import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { saveToken } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (token) {
        // Save token
        saveToken(token);
        
        // Remove token from URL
        window.history.replaceState({}, '', '/');
        
        // Refresh user data
        try {
          await refreshUser();
          // Redirect to home page
          navigate('/', { replace: true });
        } catch (error) {
          console.error('Failed to refresh user:', error);
          navigate('/', { replace: true });
        }
      } else {
        // No token, redirect to home
        navigate('/', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-ynu-blue animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">ログイン処理中...</p>
      </div>
    </div>
  );
}

