import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const BUILDINGS = [
  { id: 'building1', name: '経営学部講義棟1号館' },
  { id: 'building2', name: '経営学部講義棟2号館' },
  { id: 'library', name: '中央図書館' },
];

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
  building: string;
  period: string;
  day: string;
}

interface SearchFiltersProps {
  onSearch?: (filters: SearchFiltersValue) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFiltersValue>({
    building: BUILDINGS[0].id,
    period: PERIODS[0].id,
    day: DAYS[0].id,
  });

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const selectedBuilding = BUILDINGS.find(b => b.id === filters.building);
  const selectedPeriod = PERIODS.find(p => p.id === filters.period);
  const selectedDay = DAYS.find(d => d.id === filters.day);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
          検索条件
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Building Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              校舎・建物
            </label>
            <div className="relative">
              <select
                value={filters.building}
                onChange={(e) => setFilters({ ...filters, building: e.target.value })}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-transparent"
              >
                {BUILDINGS.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>
          </div>

          {/* Period Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              時限
            </label>
            <div className="relative">
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md appearance-none bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-ynu-blue focus:border-transparent"
              >
                {PERIODS.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.name} ({period.time})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
            </div>
          </div>

          {/* Day Selection */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              曜日
            </label>
            <div className="flex gap-2">
              {DAYS.map(day => (
                <button
                  key={day.id}
                  onClick={() => setFilters({ ...filters, day: day.id })}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                    filters.day === day.id
                      ? 'bg-ynu-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="px-4 sm:px-6 py-2 sm:py-2.5 bg-ynu-blue hover:bg-ynu-blue-dark text-white font-semibold rounded-md transition-colors text-sm w-full"
            >
              検索する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
