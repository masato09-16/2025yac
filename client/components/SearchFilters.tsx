import React, { useState } from 'react';
import { ChevronDown, Search, Building2, Clock, Calendar, GraduationCap, Filter, X, ChevronUp, Star } from 'lucide-react';
import { FACULTY_NAMES, type Faculty, BUILDINGS } from '@shared/data';
import { useAuth } from '@/contexts/AuthContext';

const PERIODS = [
  { id: '1', name: '1限', time: '8:50-10:20' },
  { id: '2', name: '2限', time: '10:30-12:00' },
  { id: '3', name: '3限', time: '13:00-14:30' },
  { id: '4', name: '4限', time: '14:40-16:10' },
  { id: '5', name: '5限', time: '16:15-17:45' },
];

const DAYS_OF_WEEK = ['月', '火', '水', '木', '金', '土', '日'];

export interface SearchFiltersValue {
  faculty: Faculty | 'all';
  building: string;
  period: string;
  status: 'all' | 'available' | 'in-use' | 'no-data' | 'favorites';
  searchMode: 'now' | 'future';
  targetDate?: string; // YYYY-MM-DD format
}

interface SearchFiltersProps {
  onSearch?: (filters: SearchFiltersValue) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<SearchFiltersValue>({
    faculty: 'all',
    building: 'all',
    period: PERIODS[0].id,
    status: 'all',
    searchMode: 'now',
    targetDate: undefined,
  });
  
  // モバイル: フィルターの折りたたみ状態
  const [isExpanded, setIsExpanded] = useState(false);

  // Get date string for N days from now
  const getDateAfterDays = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Get day of week name from date string
  const getDayOfWeek = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return DAYS_OF_WEEK[date.getDay()];
  };

  const handleSearch = () => {
    onSearch?.(filters);
    // モバイル: 検索後に折りたたむ
    setIsExpanded(false);
  };

  // 学部が選択されている場合は、その学部の建物のみを表示
  const filteredBuildings = filters.faculty === 'all' 
    ? BUILDINGS 
    : BUILDINGS.filter(b => b.faculty === filters.faculty);

  const facultyOptions = [
    { id: 'all' as const, name: 'すべての学部', short: '全' },
    ...Object.entries(FACULTY_NAMES).map(([id, names]) => ({
      id: id as Faculty,
      name: names.full,
      short: names.short,
    }))
  ];

  return (
    <div className="
      bg-gradient-to-b from-white to-gray-50 
      border-b border-gray-200 shadow-md
    ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* ヘッダー: 検索条件とモード切り替えを横並びに */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="
              flex items-center justify-center 
              w-8 h-8 sm:w-9 sm:h-9
              bg-ynu-blue rounded-lg
              shadow-sm
            ">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              検索条件
            </h2>
          </div>
          
          {/* モード切り替えボタンを横に配置 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters({ ...filters, searchMode: 'now', targetDate: undefined })}
              className={`
                px-3 sm:px-4 py-1.5 sm:py-2
                rounded-lg
                font-semibold text-xs sm:text-sm
                transition-all duration-200
                ${filters.searchMode === 'now'
                  ? 'bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              現在の空き状況
            </button>
            <button
              onClick={() => setFilters({ ...filters, searchMode: 'future', targetDate: getDateAfterDays(0) })}
              className={`
                px-3 sm:px-4 py-1.5 sm:py-2
                rounded-lg
                font-semibold text-xs sm:text-sm
                transition-all duration-200
                ${filters.searchMode === 'future'
                  ? 'bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              日時を指定
            </button>
            
            {/* モバイル: 折りたたみボタン */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="
                sm:hidden
                flex items-center justify-center
                w-8 h-8
                bg-gray-100 hover:bg-gray-200
                rounded-lg
                transition-all duration-200
              "
              aria-label={isExpanded ? 'フィルターを閉じる' : 'フィルターを開く'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-700" />
              )}
            </button>
          </div>
        </div>
        
        {/* フィルターコンテンツ: モバイルで条件付き表示、デスクトップで常に表示 */}
        <div className={`
          ${isExpanded ? 'block' : 'hidden'} sm:block
          transition-all duration-300
        `}>

          {/* フィルターグリッド
              モバイル: 1カラム（縦並び、読みやすさ優先）
              タブレット: 2カラム（情報密度バランス）
              デスクトップ: 3-6カラム（効率的な配置）
          */}
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-6 
            gap-3 sm:gap-4 lg:gap-6
          ">
            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="
                text-xs font-semibold text-gray-700 mb-1 
                flex items-center gap-1
              ">
                <Filter className="w-3 h-3 text-ynu-blue" />
                状態
              </label>
              <div className="relative group">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as 'all' | 'available' | 'in-use' | 'no-data' | 'favorites' })}
                  className="
                    w-full px-3 py-2
                    border-2 border-gray-200 rounded-lg
                    appearance-none bg-white text-gray-900 
                    text-xs sm:text-sm font-medium
                    focus:outline-none focus:ring-1 focus:ring-ynu-blue focus:border-ynu-blue
                    transition-all hover:border-ynu-blue/50
                  "
                >
                  <option value="all">すべて</option>
                  <option value="available">空きのみ</option>
                  <option value="in-use">使用中のみ</option>
                  <option value="no-data">データなし</option>
                  {isAuthenticated && (
                    <option value="favorites">お気に入りのみ</option>
                  )}
                </select>
                <ChevronDown className="
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  text-gray-400 group-hover:text-ynu-blue 
                  pointer-events-none w-5 h-5 transition-colors
                " />
              </div>
            </div>

            {/* Faculty Dropdown */}
            <div className="flex flex-col">
              <label className="
                text-xs font-semibold text-gray-700 mb-1 
                flex items-center gap-1
              ">
                <GraduationCap className="w-3 h-3 text-ynu-blue" />
                学部
              </label>
              <div className="relative group">
                <select
                  value={filters.faculty}
                  onChange={(e) => setFilters({ ...filters, faculty: e.target.value as Faculty | 'all', building: 'all' })}
                  className="
                    w-full px-3 py-2
                    border-2 border-gray-200 rounded-lg
                    appearance-none bg-white text-gray-900 
                    text-xs sm:text-sm font-medium
                    focus:outline-none focus:ring-1 focus:ring-ynu-blue focus:border-ynu-blue
                    transition-all hover:border-ynu-blue/50
                  "
                >
                  {facultyOptions.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  text-gray-400 group-hover:text-ynu-blue 
                  pointer-events-none w-5 h-5 transition-colors
                " />
              </div>
            </div>

            {/* Building Dropdown */}
            <div className="flex flex-col">
              <label className="
                text-xs font-semibold text-gray-700 mb-1 
                flex items-center gap-1
              ">
                <Building2 className="w-3 h-3 text-ynu-blue" />
                建物
              </label>
              <div className="relative group">
                <select
                  value={filters.building}
                  onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                  className="
                    w-full px-3 py-2
                    border-2 border-gray-200 rounded-lg
                    appearance-none bg-white text-gray-900 
                    text-xs sm:text-sm font-medium
                    focus:outline-none focus:ring-1 focus:ring-ynu-blue focus:border-ynu-blue
                    transition-all hover:border-ynu-blue/50
                  "
                >
                  <option value="all">すべての建物</option>
                  {filteredBuildings.map(building => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="
                  absolute right-3 top-1/2 transform -translate-y-1/2 
                  text-gray-400 group-hover:text-ynu-blue 
                  pointer-events-none w-5 h-5 transition-colors
                " />
              </div>
            </div>

            {/* Period and Date Selection - only show in future mode */}
            {filters.searchMode === 'future' && (
              <>
                {/* Period Dropdown */}
                <div className="flex flex-col">
                  <label className="
                    text-xs font-semibold text-gray-700 mb-1 
                    flex items-center gap-1
                  ">
                    <Clock className="w-3 h-3 text-ynu-blue" />
                    時限
                  </label>
                  <div className="relative group">
                    <select
                      value={filters.period}
                      onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                      className="
                        w-full px-3 py-2
                        border-2 border-gray-200 rounded-lg
                        appearance-none bg-white text-gray-900 
                        text-xs sm:text-sm font-medium
                        focus:outline-none focus:ring-1 focus:ring-ynu-blue focus:border-ynu-blue
                        transition-all hover:border-ynu-blue/50
                      "
                    >
                      {PERIODS.map(period => (
                        <option key={period.id} value={period.id}>
                          {period.name} ({period.time})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="
                      absolute right-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 group-hover:text-ynu-blue 
                      pointer-events-none w-5 h-5 transition-colors
                    " />
                  </div>
                </div>

                {/* Date Selection */}
                <div className="flex flex-col">
                  <label className="
                    text-xs font-semibold text-gray-700 mb-1 
                    flex items-center gap-1
                  ">
                    <Calendar className="w-3 h-3 text-ynu-blue" />
                    日付
                  </label>
                  <input
                    type="date"
                    value={filters.targetDate || getDateAfterDays(0)}
                    onChange={(e) => setFilters({ ...filters, targetDate: e.target.value })}
                    className="
                      w-full px-3 py-2
                      border-2 border-gray-200 rounded-lg
                      bg-white text-gray-900 
                      text-xs sm:text-sm font-medium
                      focus:outline-none focus:ring-1 focus:ring-ynu-blue focus:border-ynu-blue
                      transition-all hover:border-ynu-blue/50
                    "
                  />
                  {filters.targetDate && (
                    <p className="text-xs text-gray-600 mt-1.5 font-medium">
                      {getDayOfWeek(filters.targetDate)}曜日
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Search Button (最重要アクション: 常に目立つ位置) */}
            <div className="
              flex flex-col justify-end
              /* モバイル: フル幅、デスクトップ: 自動幅 */
              col-span-1 sm:col-span-2 lg:col-span-1
            ">
              <button
                onClick={handleSearch}
                className="
                  group w-full
                  px-4 py-2
                  bg-gradient-to-r from-ynu-blue to-ynu-blue-dark 
                  hover:from-ynu-blue-dark hover:to-ynu-blue 
                  text-white font-semibold rounded-lg
                  shadow-md hover:shadow-lg
                  transition-all duration-300
                  flex items-center justify-center gap-2
                  text-xs sm:text-sm
                "
              >
                <Search className="w-4 h-4" />
                <span>検索する</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
