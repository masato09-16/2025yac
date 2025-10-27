import React, { useState } from 'react';
import Header from '@/components/Header';
import SearchFilters, { SearchFiltersValue } from '@/components/SearchFilters';
import ClassroomCard, { ClassroomInfo } from '@/components/ClassroomCard';

// Sample classroom data
const SAMPLE_CLASSROOMS: ClassroomInfo[] = [
  {
    id: '1',
    roomNumber: '経営104',
    status: 'available',
    capacity: 120,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '2',
    roomNumber: '経営105',
    status: 'in-use',
    className: '経営学原論',
    capacity: 100,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: false,
  },
  {
    id: '3',
    roomNumber: '経営106',
    status: 'available',
    capacity: 80,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '4',
    roomNumber: '経営107',
    status: 'available',
    capacity: 150,
    hasProjector: false,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '5',
    roomNumber: '経営108',
    status: 'in-use',
    className: '管理会計論',
    capacity: 90,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '6',
    roomNumber: '経営109',
    status: 'available',
    capacity: 110,
    hasProjector: true,
    hasWifi: false,
    hasPowerOutlets: true,
  },
  {
    id: '7',
    roomNumber: '経営204',
    status: 'available',
    capacity: 130,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '8',
    roomNumber: '経営205',
    status: 'available',
    capacity: 100,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '9',
    roomNumber: '経営206',
    status: 'in-use',
    className: '財務管理論',
    capacity: 85,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: false,
  },
  {
    id: '10',
    roomNumber: '経営207',
    status: 'available',
    capacity: 120,
    hasProjector: true,
    hasWifi: true,
    hasPowerOutlets: true,
  },
  {
    id: '11',
    roomNumber: '経営208',
    status: 'available',
    capacity: 95,
    hasProjector: false,
    hasWifi: true,
    hasPowerOutlets: true,
  },
];

export default function Index() {
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersValue>({
    building: 'building1',
    period: '1',
    day: 'mon',
  });

  const handleSearch = (filters: SearchFiltersValue) => {
    setCurrentFilters(filters);
    // In a real app, you would fetch data based on filters here
  };

  // In a real app, this would be based on the currentFilters
  const displayedClassrooms = SAMPLE_CLASSROOMS;
  const availableCount = displayedClassrooms.filter(c => c.status === 'available').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <Header />

      {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} />

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Results Header with stats */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ynu-blue to-ynu-blue-dark bg-clip-text text-transparent mb-2">
              現在の空き教室
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              {availableCount} 件の教室が利用可能です
            </p>
          </div>
          
          {/* Stats badge */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
            <div className="w-3 h-3 bg-status-available rounded-full animate-pulse-subtle"></div>
            <span className="text-sm font-semibold text-gray-700">
              {availableCount} 件利用可能
            </span>
          </div>
        </div>

        {/* Classroom Cards Grid */}
        {displayedClassrooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedClassrooms.map((classroom, index) => (
              <div 
                key={classroom.id} 
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fadeInUp"
              >
                <ClassroomCard classroom={classroom} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 sm:p-16 text-center border-2 border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                該当する教室がありません
              </p>
              <p className="text-gray-500 text-sm">
                別の検索条件を試してください。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
