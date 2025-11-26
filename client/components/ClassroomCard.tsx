import React from 'react';
import { Users, Wifi, Plug, Projector, Clock, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import type { Classroom } from '@shared/data';

export type ClassroomStatus = 'available' | 'in-use';

// 後方互換性のためのエクスポート
export interface ClassroomInfo extends Classroom {}

interface ClassroomCardProps {
  classroom: Classroom | ClassroomInfo;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom }) => {
  const isAvailable = classroom.status === 'available';
  const isInUse = classroom.status === 'in-use' || classroom.status === 'occupied' || classroom.status === 'full';
  
  // データがない教室（現在の在室人数が0で授業もない）を判定
  const hasNoData = !classroom.activeClass && 
                   (!classroom.currentOccupancy || classroom.currentOccupancy === 0) &&
                   classroom.status === 'available';
  
  // Color scheme based on status (色彩心理学に基づく)
  let statusColor, borderColor, bgColor, textColor, badgeColor, statusText;
  
  if (hasNoData) {
    // データなし = 灰色（中立）
    statusColor = 'bg-gray-400';
    borderColor = 'border-gray-300 hover:border-gray-400';
    bgColor = 'bg-gray-50';
    textColor = 'text-gray-600';
    badgeColor = 'bg-gray-200 text-gray-700';
    statusText = 'データなし';
  } else if (isAvailable) {
    // 空き = 緑色（安心感、成功）
    statusColor = 'bg-green-500';
    borderColor = 'border-green-200 hover:border-green-300';
    bgColor = 'bg-white';
    textColor = 'text-green-700';
    badgeColor = 'bg-green-100 text-green-800';
    statusText = '利用可能';
  } else {
    // 使用中 = 赤色（注意喚起）
    statusColor = 'bg-red-500';
    borderColor = 'border-red-200 hover:border-red-300';
    bgColor = 'bg-red-50';
    textColor = 'text-red-700';
    badgeColor = 'bg-red-100 text-red-800';
    statusText = classroom.statusDetail || '使用中';
  }
  
  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTime = (timeStr: string) => {
    return timeStr.split(':').slice(0, 2).join(':');
  };

  // 占有率を計算（視覚的フィードバック用）
  const occupancyRate = classroom.capacity > 0 
    ? Math.min((classroom.currentOccupancy || 0) / classroom.capacity, 1.0)
    : 0;

  return (
    <div className={`
      group ${bgColor} rounded-2xl shadow-lg hover:shadow-2xl 
      transition-all duration-300 border-2 ${borderColor} 
      relative overflow-hidden 
      animate-fadeInUp
      /* モバイル: フル幅、デスクトップ: カード */
      w-full
      /* タッチターゲット最適化: 最小タップ領域を確保 */
      min-h-[140px] sm:min-h-[150px]
      /* パディング: コンパクトに */
      p-2.5 sm:p-3
    `}>
      {/* Status accent bar (視覚的階層: 最上部に重要な情報) */}
      <div className={`absolute top-0 left-0 w-full h-2 ${statusColor} transition-all duration-300`}></div>
      
      {/* モバイル: コンパクトレイアウト、デスクトップ: 詳細レイアウト */}
      <div className="flex flex-col h-full">
        {/* Room Number with status badge (最重要情報を上部に) */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-start justify-between mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`
                text-lg sm:text-xl font-bold 
                ${hasNoData ? 'text-gray-500' : isAvailable ? 'text-ynu-blue' : 'text-red-600'}
                truncate
              `}>
                {classroom.roomNumber}
              </h3>
              {/* 建物・階層情報（モバイルで非表示、デスクトップで表示） */}
              <div className="hidden sm:flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-gray-500" />
                <span className="text-[10px] text-gray-600">{classroom.floor}階</span>
              </div>
            </div>
            {/* ステータスバッジ（視覚的フィードバック） */}
            <div className={`
              ${badgeColor} px-2 py-0.5 sm:px-2 sm:py-1 
              rounded-full shadow-sm
              flex-shrink-0
              /* タッチターゲット: 最小44x44px */
              min-w-[60px] min-h-[22px] sm:min-h-[24px]
              flex items-center justify-center
            `}>
              <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {hasNoData ? 'データなし' : isAvailable ? '空き' : '使用中'}
              </span>
            </div>
          </div>
          {/* ステータスインジケーター */}
          <div className="flex items-center gap-1.5">
            <div className={`
              ${statusColor} h-1.5 w-10 sm:w-12 rounded-full 
              ${isAvailable && !hasNoData ? 'animate-pulse-subtle' : ''}
              transition-all duration-300
            `}></div>
            <span className={`text-[10px] sm:text-xs font-semibold ${textColor}`}>
              {statusText}
            </span>
          </div>
        </div>

        {/* Active Class Information (条件付き表示) */}
        {isInUse && classroom.activeClass && (
          <div className="mb-2 p-1.5 sm:p-2 bg-white rounded-md border-2 border-red-200 shadow-sm">
            <div className="flex items-start gap-1.5">
              <div className="flex items-center justify-center w-6 h-6 sm:w-6 sm:h-6 bg-red-100 rounded-md flex-shrink-0">
                <BookOpen className="w-3 h-3 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-bold text-gray-900 mb-0.5 truncate">
                  {classroom.activeClass.class_name}
                </p>
                {classroom.activeClass.instructor && (
                  <div className="flex items-center gap-0.5 mb-0.5">
                    <GraduationCap className="w-2.5 h-2.5 text-gray-500 flex-shrink-0" />
                    <p className="text-[10px] text-gray-600 truncate">{classroom.activeClass.instructor}</p>
                  </div>
                )}
                <div className="flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-gray-500 flex-shrink-0" />
                  <p className="text-[10px] text-gray-600">
                    {formatTime(classroom.activeClass.start_time)} - {formatTime(classroom.activeClass.end_time)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Capacity and Occupancy (最重要情報: 人数) */}
        <div className="mb-2 sm:mb-3 flex-1">
          <div className={`
            flex items-center gap-2 sm:gap-3 p-2 sm:p-3 
            rounded-lg border-2 
            ${hasNoData ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}
            shadow-sm
            /* タッチターゲット最適化 */
            min-h-[60px] sm:min-h-[64px]
          `}>
            <div className={`
              flex items-center justify-center 
              w-10 h-10 sm:w-11 sm:h-11
              rounded-lg
              ${hasNoData ? 'bg-gray-200' : isAvailable ? 'bg-green-50' : 'bg-red-50'}
              flex-shrink-0
            `}>
              <Users className={`
                w-5 h-5 sm:w-6 sm:h-6
                ${hasNoData ? 'text-gray-500' : isAvailable ? 'text-green-600' : 'text-red-600'}
              `} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`
                text-[10px] sm:text-xs font-medium mb-0.5
                ${hasNoData ? 'text-gray-500' : 'text-gray-600'}
              `}>
                定員 / 現在の人数
              </p>
              <div className="flex items-baseline gap-1 flex-wrap">
                <p className={`
                  text-xs sm:text-sm font-bold
                  ${hasNoData ? 'text-gray-600' : 'text-gray-900'}
                `}>
                  {classroom.capacity}名
                </p>
                {classroom.currentOccupancy !== undefined && (
                  <>
                    <span className="text-gray-400 text-[10px]">→</span>
                    <span className={`
                      text-sm sm:text-base font-extrabold
                      ${hasNoData ? 'text-gray-500' : isAvailable ? 'text-green-600' : 'text-red-600'}
                    `}>
                      {classroom.currentOccupancy}名
                    </span>
                    {/* 占有率バー（デスクトップのみ） */}
                    <div className="hidden lg:flex items-center gap-1.5 ml-auto">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            occupancyRate < 0.5 ? 'bg-green-500' : 
                            occupancyRate < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${occupancyRate * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {Math.round(occupancyRate * 100)}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features (設備情報) */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap">
          {classroom.hasProjector && (
            <div
              className="
                flex items-center justify-center 
                w-7 h-7 sm:w-8 sm:h-8 
                bg-blue-50 rounded-md
                hover:bg-blue-100 active:bg-blue-200
                transition-all duration-200 
                hover:scale-110 active:scale-95
                /* タッチターゲット: 最小44x44px */
                cursor-pointer
                shadow-sm
              "
              title="プロジェクター"
            >
              <Projector className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          )}
          {classroom.hasWifi && (
            <div
              className="
                flex items-center justify-center 
                w-7 h-7 sm:w-8 sm:h-8 
                bg-green-50 rounded-md
                hover:bg-green-100 active:bg-green-200
                transition-all duration-200 
                hover:scale-110 active:scale-95
                cursor-pointer
                shadow-sm
              "
              title="Wi-Fi"
            >
              <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
          )}
          {classroom.hasPowerOutlets && (
            <div
              className="
                flex items-center justify-center 
                w-7 h-7 sm:w-8 sm:h-8 
                bg-amber-50 rounded-md
                hover:bg-amber-100 active:bg-amber-200
                transition-all duration-200 
                hover:scale-110 active:scale-95
                cursor-pointer
                shadow-sm
              "
              title="電源コンセント"
            >
              <Plug className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomCard;
