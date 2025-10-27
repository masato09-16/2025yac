import React, { useState } from 'react';
import { ChevronDown, Search, Building2, Clock, Calendar, GraduationCap, Filter } from 'lucide-react';
import { FACULTY_NAMES, type Faculty, BUILDINGS } from '@shared/data';

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
  status: 'all' | 'available' | 'in-use' | 'no-data';
  searchMode: 'now' | 'future';
  targetDate?: string; // YYYY-MM-DD format
}

interface SearchFiltersProps {
  onSearch?: (filters: SearchFiltersValue) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFiltersValue>({
    faculty: 'all',
    building: 'all',
    period: PERIODS[0].id,
    status: 'all',
    searchMode: 'now',
    targetDate: undefined,
  });

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
    <div className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-2 mb-6">
          <Search className="w-5 h-5 text-ynu-blue" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            検索条件
          </h2>
        </div>
        
        {/* Search Mode Toggle */}
        <div className="mb-6 flex items-center justify-center gap-4 bg-white rounded-lg p-3 shadow-md border-2 border-gray-200">
          <button
            onClick={() => setFilters({ ...filters, searchMode: 'now', targetDate: undefined })}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              filters.searchMode === 'now'
                ? 'bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📍 現在の空き状況
          </button>
          <button
            onClick={() => setFilters({ ...filters, searchMode: 'future', targetDate: getDateAfterDays(0) })}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              filters.searchMode === 'future'
                ? 'bg-gradient-to-r from-ynu-blue to-ynu-blue-dark text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔮 日時を指定して検索
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Filter className="w-4 h-4 text-ynu-blue" />
              状態
            </label>
            <div className="relative group">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as 'all' | 'available' | 'in-use' | 'no-data' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-ynu-blue transition-all hover:border-ynu-blue/50"
              >
                <option value="all">すべて</option>
                <option value="available">🟢 空きのみ</option>
                <option value="in-use">🔴 使用中のみ</option>
                <option value="no-data">⚫ データなし</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-ynu-blue pointer-events-none w-5 h-5 transition-colors" />
            </div>
          </div>

          {/* Faculty Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-ynu-blue" />
              学部
            </label>
            <div className="relative group">
              <select
                value={filters.faculty}
                onChange={(e) => setFilters({ ...filters, faculty: e.target.value as Faculty | 'all', building: 'all' })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-ynu-blue transition-all hover:border-ynu-blue/50"
              >
                {facultyOptions.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-ynu-blue pointer-events-none w-5 h-5 transition-colors" />
            </div>
          </div>

          {/* Building Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-ynu-blue" />
              建物
            </label>
            <div className="relative group">
              <select
                value={filters.building}
                onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-ynu-blue transition-all hover:border-ynu-blue/50"
              >
                <option value="all">すべての建物</option>
                {filteredBuildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-ynu-blue pointer-events-none w-5 h-5 transition-colors" />
            </div>
          </div>

          {/* Period and Date Selection - only show in future mode */}
          {filters.searchMode === 'future' && (
            <>
              {/* Period Dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-ynu-blue" />
                  時限
                </label>
                <div className="relative group">
                  <select
                    value={filters.period}
                    onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg appearance-none bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-ynu-blue transition-all hover:border-ynu-blue/50"
                  >
                    {PERIODS.map(period => (
                      <option key={period.id} value={period.id}>
                        {period.name} ({period.time})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-ynu-blue pointer-events-none w-5 h-5 transition-colors" />
                </div>
              </div>

              {/* Date Selection */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-ynu-blue" />
                  日付を選択
                </label>
                <input
                  type="date"
                  value={filters.targetDate || getDateAfterDays(0)}
                  onChange={(e) => setFilters({ ...filters, targetDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-ynu-blue transition-all hover:border-ynu-blue/50"
                />
                {filters.targetDate && (
                  <p className="text-xs text-gray-600 mt-1">
                    {getDayOfWeek(filters.targetDate)}曜日
                  </p>
                )}
              </div>
            </>
          )}

          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSearch}
              className="group px-6 py-3 bg-gradient-to-r from-ynu-blue to-ynu-blue-dark hover:from-ynu-blue-dark hover:to-ynu-blue text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Search className="w-5 h-5" />
              検索する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
