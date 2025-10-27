import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import SearchFilters, { SearchFiltersValue } from '@/components/SearchFilters';
import ClassroomCard from '@/components/ClassroomCard';
import { ALL_CLASSROOMS } from '@shared/classrooms';
import { FACULTY_NAMES } from '@shared/data';
import { Grid3x3, GraduationCap } from 'lucide-react';

export default function Index() {
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersValue>({
    faculty: 'all',
    building: 'all',
    period: '1',
    day: 'mon',
  });

  const handleSearch = (filters: SearchFiltersValue) => {
    setCurrentFilters(filters);
    // In a real app, you would fetch data based on filters here
  };

  // Filter classrooms based on current filters
  const displayedClassrooms = useMemo(() => {
    let filtered = ALL_CLASSROOMS;

    // Filter by faculty
    if (currentFilters.faculty !== 'all') {
      filtered = filtered.filter(c => c.faculty === currentFilters.faculty);
    }

    // Filter by building
    if (currentFilters.building !== 'all') {
      filtered = filtered.filter(c => c.buildingId === currentFilters.building);
    }

    // Sort by room number for better organization
    return filtered.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
  }, [currentFilters]);

  const availableCount = displayedClassrooms.filter(c => c.status === 'available').length;
  
  // Group classrooms by faculty for display
  const classroomsByFaculty = useMemo(() => {
    const groups: Record<string, typeof displayedClassrooms> = {};
    displayedClassrooms.forEach(classroom => {
      const faculty = classroom.faculty;
      if (!groups[faculty]) {
        groups[faculty] = [];
      }
      groups[faculty].push(classroom);
    });
    return groups;
  }, [displayedClassrooms]);

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

        {/* Display classrooms grouped by faculty */}
        {Object.keys(classroomsByFaculty).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(classroomsByFaculty).map(([faculty, classrooms]) => {
              const facultyName = FACULTY_NAMES[faculty as keyof typeof FACULTY_NAMES];
              const facultyAvailable = classrooms.filter(c => c.status === 'available').length;
              
              return (
                <div key={faculty} className="animate-fadeInUp">
                  {/* Faculty Header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-ynu-blue to-ynu-blue-dark rounded-xl shadow-lg">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{facultyName?.full || faculty}</h3>
                      <p className="text-sm text-gray-600">{facultyAvailable} 件の教室が利用可能</p>
                    </div>
                  </div>
                  
                  {/* Classroom Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classrooms.map((classroom, index) => (
                      <div 
                        key={classroom.id} 
                        style={{ animationDelay: `${index * 50}ms` }}
                        className="animate-fadeInUp"
                      >
                        <ClassroomCard classroom={classroom} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
