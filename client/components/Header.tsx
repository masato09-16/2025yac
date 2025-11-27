import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Clock, HelpCircle, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = async () => {
    try {
      console.log('Initiating login...');
      await login();
      console.log('Login initiated, redirecting...');
    } catch (error) {
      console.error('Login failed:', error);
      alert('ログインに失敗しました。Google OAuth認証情報が設定されているか確認してください。');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-ynu-blue via-ynu-blue to-ynu-blue-dark border-b border-ynu-blue shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* YNU Logo with animated shine effect */}
            <Link to="/">
              <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer">
                <span className="text-ynu-blue font-bold text-lg sm:text-xl relative z-10">YNU</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </Link>
            
            {/* Title with enhanced styling */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                YNU-TWIN
              </h1>
              <p className="text-xs sm:text-sm text-white/90 mt-0.5 font-medium">
                横浜国立大学 空き教室検索システム
              </p>
            </div>
          </div>

          {/* Right side: Auth, Help button and Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-1.5
                    bg-white/10 hover:bg-white/20 backdrop-blur-sm
                    px-2 sm:px-3 py-2 rounded-full
                    text-white text-xs sm:text-sm font-medium
                    transition-all duration-200
                    border border-white/20
                  "
                  title={user?.name || 'ログアウト'}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="
                  flex items-center gap-1.5
                  bg-white/10 hover:bg-white/20 backdrop-blur-sm
                  px-2 sm:px-3 py-2 rounded-full
                  text-white text-xs sm:text-sm font-medium
                  transition-all duration-200
                  border border-white/20
                "
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ログイン</span>
              </button>
            )}
            
            {/* Help/About button */}
            <Link to="/about">
              <button className="
                flex items-center gap-1.5
                bg-white/10 hover:bg-white/20 backdrop-blur-sm
                px-2 sm:px-3 py-2 rounded-full
                text-white text-xs sm:text-sm font-medium
                transition-all duration-200
                border border-white/20
              ">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">使い方</span>
              </button>
            </Link>
            
            {/* Time indicator with real-time updates */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-2 rounded-full">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white">
                {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
