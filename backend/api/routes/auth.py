"""
Authentication API routes (Google OAuth)
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import secrets
from urllib.parse import urlencode
import httpx

from database.session import get_db
from database.models.user import User
from config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])

# In-memory session store (in production, use Redis or database)
session_store: dict[str, dict] = {}


@router.get("/login")
async def login():
    """Initiate Google OAuth login"""
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(
            status_code=503,
            detail="Google OAuth認証情報が設定されていません。GOOGLE_CLIENT_IDとGOOGLE_CLIENT_SECRETを.envファイルに設定してください。"
        )
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    session_store[state] = {"type": "login"}
    
    # Build authorization URL manually
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "online",
    }
    
    authorization_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    return {"authorization_url": authorization_url}


@router.get("/callback")
async def callback(
    code: str,
    state: str,
    db: Session = Depends(get_db),
    response: Response = None
):
    """Handle Google OAuth callback"""
    # Verify state
    if state not in session_store:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    try:
        # Exchange code for token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.google_redirect_uri,
                },
            )
            token_response.raise_for_status()
            token_data = token_response.json()
            access_token = token_data["access_token"]
            
            # Get user info
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            user_info_response.raise_for_status()
            user_data = user_info_response.json()
        
        # Create or update user
        user = db.query(User).filter(User.id == user_data["id"]).first()
        if not user:
            user = User(
                id=user_data["id"],
                email=user_data["email"],
                name=user_data.get("name", ""),
                picture=user_data.get("picture"),
                last_login=datetime.utcnow(),
            )
            db.add(user)
        else:
            user.name = user_data.get("name", user.name)
            user.picture = user_data.get("picture", user.picture)
            user.last_login = datetime.utcnow()
        
        db.commit()
        db.refresh(user)
        
        # Create session token
        session_token = secrets.token_urlsafe(32)
        session_store[session_token] = {
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
        }
        
        # Clean up state
        del session_store[state]
        
        # Redirect to frontend with session token
        frontend_url = "http://localhost:8080"  # TODO: Make this configurable
        redirect_url = f"{frontend_url}/auth/callback?token={session_token}"
        
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")


@router.get("/me")
async def get_current_user(
    token: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get current user information"""
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")
    
    if token not in session_store:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    session_data = session_store[token]
    user_id = session_data.get("user_id")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
    }


@router.post("/logout")
async def logout(token: Optional[str] = None):
    """Logout user"""
    if token and token in session_store:
        del session_store[token]
    
    return {"message": "Logged out successfully"}

