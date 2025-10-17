import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-start gap-4 sm:gap-6">
          {/* YNU Logo Placeholder */}
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-ynu-blue rounded-lg">
            <span className="text-white font-bold text-lg">YNU</span>
          </div>
          
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              経営学部 空き教室検索
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              横浜国立大学
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
