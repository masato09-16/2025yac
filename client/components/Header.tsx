import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

          {/* Time indicator with real-time updates */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
