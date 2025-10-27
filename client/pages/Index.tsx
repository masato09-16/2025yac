import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import SearchFilters, { SearchFiltersValue } from '@/components/SearchFilters';
import ClassroomCard from '@/components/ClassroomCard';
import { FACULTY_NAMES, type Classroom as SharedClassroom, type Faculty } from '@shared/data';
import { GraduationCap } from 'lucide-react';
import { getClassroomsWithStatus } from '@/lib/api';

export default function Index() {
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersValue>({
    faculty: 'all',
    building: 'all',
    period: '1',
    day: 'mon',
  });
  const [classrooms, setClassrooms] = useState<SharedClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classrooms from API
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: any = {};
        if (currentFilters.faculty !== 'all') {
          params.faculty = currentFilters.faculty;
        }
        if (currentFilters.building !== 'all') {
          params.building_id = currentFilters.building;
        }
        
        const data = await getClassroomsWithStatus(params);
        
        // Convert API data to frontend format
        const convertedClassrooms: SharedClassroom[] = data.map((item) => {
          const classroom = item.classroom;
          const occupancy = item.occupancy;
          
          // Map backend status to frontend status
          let status: 'available' | 'in-use' | 'occupied' | 'full' = 'available';
          const backendStatus = item.status;
          
          if (backendStatus === 'in-class' || backendStatus === 'scheduled-low') {
            status = 'in-use';
          } else if (backendStatus === 'occupied') {
            status = 'full';
          } else if (backendStatus === 'partially-occupied') {
            status = 'occupied';
          } else {
            status = 'available';
          }
          
          const currentOccupancy = occupancy?.current_count || 0;
          
          return {
            id: classroom.id,
            roomNumber: classroom.room_number,
            buildingId: classroom.building_id,
            faculty: classroom.faculty as Faculty,
            floor: classroom.floor,
            capacity: classroom.capacity,
            currentOccupancy,
            status,
            className: item.active_class?.class_name,
            hasProjector: classroom.has_projector,
            hasWifi: classroom.has_wifi,
            hasPowerOutlets: classroom.has_power_outlets,
            lastUpdated: occupancy?.last_updated || new Date().toISOString(),
            statusDetail: item.status_detail,
            activeClass: item.active_class,
          };
        });
        
        setClassrooms(convertedClassrooms);
      } catch (err) {
        console.error('Failed to fetch classrooms:', err);
        setError('教室データの取得に失敗しました');
        setClassrooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [currentFilters.faculty, currentFilters.building]);

  const handleSearch = (filters: SearchFiltersValue) => {
    setCurrentFilters(filters);
  };

  // Filter and sort classrooms
  const displayedClassrooms = useMemo(() => {
    // Sort by room number for better organization
    return classrooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
  }, [classrooms]);

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
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-ynu-blue border-r-transparent"></div>
            <p className="mt-4 text-gray-600">データを読み込んでいます...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-sm text-red-500 mt-2">バックエンドサーバーが起動していることを確認してください</p>
          </div>
        )}

        {/* Results Header with stats */}
        {!loading && !error && (
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ynu-blue to-ynu-blue-dark bg-clip-text text-transparent mb-2">
              教室一覧
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              全 {displayedClassrooms.length} 件中 {availableCount} 件が利用可能です
            </p>
          </div>
          
          {/* Stats badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-green-50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-subtle"></div>
              <span className="text-sm font-semibold text-green-700">
                空き: {availableCount}件
              </span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-red-200">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-semibold text-red-700">
                使用中: {displayedClassrooms.length - availableCount}件
              </span>
            </div>
          </div>
        </div>
        )}

        {/* Display classrooms grouped by faculty */}
        {!loading && !error && Object.keys(classroomsByFaculty).length > 0 ? (
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
                  
                  {/* Classroom Cards Grid - 4 columns on desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
        ) : !loading && !error ? (
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
        ) : null}
      </div>
    </div>
  );
}
