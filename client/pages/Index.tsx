import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import SearchFilters, { SearchFiltersValue } from '@/components/SearchFilters';
import ClassroomCard from '@/components/ClassroomCard';
import { FACULTY_NAMES, type Classroom as SharedClassroom, type Faculty } from '@shared/data';
import { GraduationCap, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { getClassroomsWithStatus } from '@/lib/api';

const PERIODS = [
  { id: '1', name: '1限', time: '8:50-10:20' },
  { id: '2', name: '2限', time: '10:30-12:00' },
  { id: '3', name: '3限', time: '13:00-14:30' },
  { id: '4', name: '4限', time: '14:40-16:10' },
  { id: '5', name: '5限', time: '16:15-17:45' },
];

export default function Index() {
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersValue>({
    faculty: 'all',
    building: 'all',
    period: '1',
    status: 'all',
    searchMode: 'now',
    targetDate: undefined,
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
        
        // Add date and period parameters if in future mode
        if (currentFilters.searchMode === 'future' && currentFilters.targetDate) {
          params.target_date = currentFilters.targetDate;
          params.target_period = parseInt(currentFilters.period);
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
            imageUrl: item.image_url,
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
  }, [currentFilters.faculty, currentFilters.building, currentFilters.searchMode, currentFilters.targetDate, currentFilters.period]);

  const handleSearch = (filters: SearchFiltersValue) => {
    setCurrentFilters(filters);
  };

  // Filter and sort classrooms
  const displayedClassrooms = useMemo(() => {
    let filtered = [...classrooms];
    
    // Apply status filter
    if (currentFilters.status !== 'all') {
      filtered = filtered.filter(classroom => {
        // Check if classroom has no data (no schedule and no occupancy)
        const hasNoData = !classroom.activeClass && !classroom.currentOccupancy;
        
        if (currentFilters.status === 'available') {
          return classroom.status === 'available' && !hasNoData;
        } else if (currentFilters.status === 'in-use') {
          return classroom.status === 'in-use' || classroom.status === 'full' || classroom.status === 'occupied';
        } else if (currentFilters.status === 'no-data') {
          return hasNoData;
        }
        return true;
      });
    }
    
    // Sort by room number for better organization
    return filtered.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
  }, [classrooms, currentFilters.status]);

  const availableCount = displayedClassrooms.filter(c => {
    const hasNoData = !c.activeClass && !c.currentOccupancy;
    return c.status === 'available' && !hasNoData;
  }).length;
  
  const inUseCount = displayedClassrooms.filter(c => 
    c.status === 'in-use' || c.status === 'full' || c.status === 'occupied'
  ).length;
  
  const noDataCount = displayedClassrooms.filter(c => 
    !c.activeClass && !c.currentOccupancy
  ).length;
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <div className="inline-block h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-solid border-ynu-blue border-r-transparent"></div>
            <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">データを読み込んでいます...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8 text-center shadow-lg">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-bold text-base sm:text-lg mb-2">{error}</p>
            <p className="text-sm sm:text-base text-red-600">バックエンドサーバーが起動していることを確認してください</p>
          </div>
        )}

        {/* Results Header with stats (視覚的階層: 重要な情報を上部に) */}
        {!loading && !error && (
          <div className="mb-4 sm:mb-6">
            {/* タイトルと統計を横並びに */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h2 className="
                  text-base sm:text-lg lg:text-xl font-bold 
                  bg-gradient-to-r from-ynu-blue to-ynu-blue-dark bg-clip-text text-transparent 
                  mb-1
                ">
                  {currentFilters.searchMode === 'now' ? '現在の教室一覧' : '指定日時の教室一覧'}
                </h2>
                <p className="text-xs text-gray-600">
                  {currentFilters.searchMode === 'future' && currentFilters.targetDate && (
                    <span className="text-ynu-blue font-semibold mr-1.5">
                      📅 {currentFilters.targetDate} {PERIODS.find(p => p.id === currentFilters.period)?.name}
                    </span>
                  )}
                  全 {displayedClassrooms.length} 件
                </p>
              </div>
              
              {/* Stats badges (タイトルの横に配置) */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="
                  flex items-center gap-1.5
                  bg-green-50 px-2.5 py-1.5
                  rounded-full shadow-sm border border-green-200
                ">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-green-700">
                    空き: {availableCount}
                  </span>
                </div>
                <div className="
                  flex items-center gap-1.5
                  bg-red-50 px-2.5 py-1.5
                  rounded-full shadow-sm border border-red-200
                ">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-red-700">
                    使用中: {inUseCount}
                  </span>
                </div>
                {noDataCount > 0 && (
                  <div className="
                    flex items-center gap-1.5
                    bg-gray-50 px-2.5 py-1.5
                    rounded-full shadow-sm border border-gray-200
                  ">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs font-semibold text-gray-600">
                      データなし: {noDataCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Display classrooms grouped by faculty */}
        {!loading && !error && Object.keys(classroomsByFaculty).length > 0 ? (
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {Object.entries(classroomsByFaculty).map(([faculty, classrooms]) => {
              const facultyName = FACULTY_NAMES[faculty as keyof typeof FACULTY_NAMES];
              const facultyAvailable = classrooms.filter(c => {
                const hasNoData = !c.activeClass && !c.currentOccupancy;
                return c.status === 'available' && !hasNoData;
              }).length;
              
              return (
                <div key={faculty} className="animate-fadeInUp">
                  {/* Faculty Header (視覚的階層: セクション区切り) */}
                  <div className="
                    mb-3 sm:mb-4 lg:mb-5 
                    flex items-center gap-2 sm:gap-3
                    p-2.5 sm:p-3 bg-white rounded-xl shadow-md border-2 border-gray-100
                  ">
                    <div className="
                      flex items-center justify-center 
                      w-8 h-8 sm:w-10 sm:h-10
                      bg-gradient-to-br from-ynu-blue to-ynu-blue-dark 
                      rounded-lg shadow-lg
                      flex-shrink-0
                    ">
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="
                        text-base sm:text-lg lg:text-xl font-bold text-gray-900
                        mb-0.5
                      ">
                        {facultyName?.full || faculty}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          {facultyAvailable} 件の教室が利用可能
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Classroom Cards Grid 
                     モバイル: 2カラム（コンパクトに）
                     タブレット: 3カラム
                     デスクトップ: 5-6カラム（効率的な情報表示）
                  */}
                  <div className="
                    grid 
                    grid-cols-2 
                    sm:grid-cols-3 
                    lg:grid-cols-4 
                    xl:grid-cols-5 
                    2xl:grid-cols-6
                    gap-2 sm:gap-3 lg:gap-4
                  ">
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
          <div className="
            bg-white rounded-2xl shadow-xl p-8 sm:p-12 lg:p-16 
            text-center border-2 border-dashed border-gray-300
          ">
            <div className="max-w-md mx-auto">
              <div className="
                w-16 h-16 sm:w-20 sm:h-20 
                bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6 
                flex items-center justify-center
              ">
                <Info className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-bold mb-2">
                該当する教室がありません
              </p>
              <p className="text-gray-500 text-sm sm:text-base">
                別の検索条件を試してください。
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
