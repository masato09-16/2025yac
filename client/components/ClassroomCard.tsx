import React from 'react';
import { Users, Wifi, Plug, Projector, Clock, BookOpen, GraduationCap } from 'lucide-react';
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
  
  // Color scheme based on status
  let statusColor, borderColor, bgColor, textColor, badgeColor, statusText;
  
  if (hasNoData) {
    // データなし = 灰色
    statusColor = 'bg-gray-400';
    borderColor = 'border-gray-300 hover:border-gray-400';
    bgColor = 'bg-gray-50';
    textColor = 'text-gray-600';
    badgeColor = 'bg-gray-200 text-gray-700';
    statusText = 'データなし';
  } else if (isAvailable) {
    // 空き = 緑色
    statusColor = 'bg-green-500';
    borderColor = 'border-gray-100 hover:border-green-200';
    bgColor = 'bg-white';
    textColor = 'text-green-600';
    badgeColor = 'bg-green-100 text-green-700';
    statusText = '利用可能';
  } else {
    // 使用中 = 赤色
    statusColor = 'bg-red-500';
    borderColor = 'border-red-200 hover:border-red-300';
    bgColor = 'bg-red-50';
    textColor = 'text-red-600';
    badgeColor = 'bg-red-100 text-red-700';
    statusText = classroom.statusDetail || '使用中';
  }
  
  // Format time from "HH:MM:SS" to "HH:MM"
  const formatTime = (timeStr: string) => {
    return timeStr.split(':').slice(0, 2).join(':');
  };

  return (
    <div className={`group ${bgColor} rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-4 sm:p-5 border-2 ${borderColor} relative overflow-hidden animate-fadeInUp`}>
      {/* Status accent bar */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${statusColor}`}></div>
      
      {/* Room Number with status badge */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-2xl sm:text-3xl font-bold ${hasNoData ? 'text-gray-500' : isAvailable ? 'text-ynu-blue' : 'text-red-600'}`}>
            {classroom.roomNumber}
          </h3>
          <div className={`${badgeColor} px-3 py-1 rounded-full`}>
            <span className="text-xs font-bold">
              {hasNoData ? 'データなし' : isAvailable ? '空き' : '使用中'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${statusColor} h-1.5 w-12 rounded-full ${isAvailable && !hasNoData ? 'animate-pulse-subtle' : ''}`}></div>
          <span className={`text-xs font-semibold ${textColor}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Active Class Information */}
      {isInUse && classroom.activeClass && (
        <div className="mb-3 p-3 bg-white rounded-lg border-2 border-red-200 shadow-sm">
          <div className="flex items-start gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg flex-shrink-0">
              <BookOpen className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 mb-0.5 truncate">
                {classroom.activeClass.class_name}
              </p>
              {classroom.activeClass.instructor && (
                <div className="flex items-center gap-1 mb-0.5">
                  <GraduationCap className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <p className="text-xs text-gray-600 truncate">{classroom.activeClass.instructor}</p>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  {formatTime(classroom.activeClass.start_time)} - {formatTime(classroom.activeClass.end_time)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capacity and Features */}
      <div className="space-y-3">
        {/* Capacity */}
        <div className={`flex items-center gap-2 p-2.5 rounded-lg border ${hasNoData ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${hasNoData ? 'bg-gray-200' : 'bg-blue-50'}`}>
            <Users className={`w-4 h-4 ${hasNoData ? 'text-gray-500' : isAvailable ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-xs font-medium ${hasNoData ? 'text-gray-500' : 'text-gray-500'}`}>定員</p>
            <p className={`text-sm font-bold ${hasNoData ? 'text-gray-600' : 'text-gray-900'}`}>
              {classroom.capacity}名
              {classroom.currentOccupancy !== undefined && classroom.currentOccupancy > 0 && (
                <span className="ml-1.5 text-xs font-normal text-gray-600">
                  (現在: {classroom.currentOccupancy}名)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Features - Compact */}
        <div className="flex items-center gap-2 justify-center">
          {classroom.hasProjector && (
            <div
              className="flex items-center justify-center w-9 h-9 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-110"
              title="プロジェクター"
            >
              <Projector className="w-4 h-4 text-blue-600" />
            </div>
          )}
          {classroom.hasWifi && (
            <div
              className="flex items-center justify-center w-9 h-9 bg-green-50 rounded-lg hover:bg-green-100 transition-all duration-200 hover:scale-110"
              title="Wi-Fi"
            >
              <Wifi className="w-4 h-4 text-green-600" />
            </div>
          )}
          {classroom.hasPowerOutlets && (
            <div
              className="flex items-center justify-center w-9 h-9 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all duration-200 hover:scale-110"
              title="電源コンセント"
            >
              <Plug className="w-4 h-4 text-amber-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomCard;
