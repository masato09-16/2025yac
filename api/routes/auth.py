"""
Authentication API routes (Google OAuth)
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import secrets
from urllib.parse import urlencode
import httpx
from jose import jwt, JWTError

from ..database.session import get_db
from ..database.models.user import User
from ..config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])

# JWT settings for state and session tokens
JWT_ALGORITHM = "HS256"
STATE_EXPIRE_MINUTES = 10  # State tokens expire in 10 minutes
SESSION_EXPIRE_DAYS = 30  # Session tokens expire in 30 days


def create_state_token() -> str:
    """Create a JWT state token for CSRF protection"""
    expire = datetime.utcnow() + timedelta(minutes=STATE_EXPIRE_MINUTES)
    to_encode = {
        "exp": expire,
        "type": "oauth_state",
        "nonce": secrets.token_urlsafe(16)
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=JWT_ALGORITHM)


def verify_state_token(token: str) -> bool:
    """Verify a JWT state token"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[JWT_ALGORITHM])
        return payload.get("type") == "oauth_state"
    except JWTError:
        return False


def create_session_token(user_id: str, email: str, name: str) -> str:
    """Create a JWT session token"""
    expire = datetime.utcnow() + timedelta(days=SESSION_EXPIRE_DAYS)
    to_encode = {
        "exp": expire,
        "type": "session",
        "user_id": user_id,
        "email": email,
        "name": name
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=JWT_ALGORITHM)


def verify_session_token(token: str) -> Optional[dict]:
    """Verify a JWT session token and return user data"""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "session":
            return None
        return {
            "user_id": payload.get("user_id"),
            "email": payload.get("email"),
            "name": payload.get("name")
        }
    except JWTError:
        return None


@router.get("/login")
async def login():
    """Initiate Google OAuth login"""
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(
            status_code=503,
            detail="Google OAuth認証情報が設定されていません。GOOGLE_CLIENT_IDとGOOGLE_CLIENT_SECRETを.envファイルに設定してください。"
        )
    
    # Generate JWT state token for CSRF protection
    state = create_state_token()
    
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
    # Verify JWT state token
    if not verify_state_token(state):
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
        
        # Create JWT session token
        session_token = create_session_token(user.id, user.email, user.name)
        
        # Redirect to frontend with session token
        redirect_url = f"{settings.frontend_url}/auth/callback?token={session_token}"
        
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
    
    # Verify JWT session token
    session_data = verify_session_token(token)
    if not session_data:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
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
    # With JWT tokens, logout is handled client-side by removing the token
    # No server-side action needed since tokens are stateless
    return {"message": "Logged out successfully"}

