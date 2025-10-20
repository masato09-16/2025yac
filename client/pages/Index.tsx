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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Search Filters */}
      <SearchFilters onSearch={handleSearch} />

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            現在の空き教室
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {availableCount} 件の教室が利用可能です
          </p>
        </div>

        {/* Classroom Cards Grid */}
        {displayedClassrooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedClassrooms.map(classroom => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-card p-8 sm:p-12 text-center">
            <p className="text-gray-500 text-base sm:text-lg">
              該当する教室がありません。別の検索条件を試してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
