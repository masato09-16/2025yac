import React, { useState } from 'react';
import { ChevronDown, Search, Building2, Clock, Calendar, GraduationCap } from 'lucide-react';
import { FACULTY_NAMES, type Faculty, BUILDINGS } from '@shared/data';

const PERIODS = [
  { id: '1', name: '1限', time: '8:50-10:20' },
  { id: '2', name: '2限', time: '10:30-12:00' },
  { id: '3', name: '3限', time: '13:00-14:30' },
  { id: '4', name: '4限', time: '14:40-16:10' },
  { id: '5', name: '5限', time: '16:15-17:45' },
];

const DAYS = [
  { id: 'mon', name: '月', label: 'Monday' },
  { id: 'tue', name: '火', label: 'Tuesday' },
  { id: 'wed', name: '水', label: 'Wednesday' },
  { id: 'thu', name: '木', label: 'Thursday' },
  { id: 'fri', name: '金', label: 'Friday' },
];

export interface SearchFiltersValue {
  faculty: Faculty | 'all';
  building: string;
  period: string;
  day: string;
}

interface SearchFiltersProps {
  onSearch?: (filters: SearchFiltersValue) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFiltersValue>({
    faculty: 'all',
    building: 'all',
    period: PERIODS[0].id,
    day: DAYS[0].id,
  });

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
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

          {/* Day Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4 text-ynu-blue" />
              曜日
            </label>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {DAYS.map(day => (
                <button
                  key={day.id}
                  onClick={() => setFilters({ ...filters, day: day.id })}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    filters.day === day.id
                      ? 'bg-ynu-blue text-white shadow-md scale-105'
                      : 'bg-transparent text-gray-700 hover:bg-white/80'
                  }`}
                  title={day.label}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

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
