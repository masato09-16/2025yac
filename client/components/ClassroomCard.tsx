import React from 'react';
import { Users, Wifi, Plug, Projector } from 'lucide-react';
import type { Classroom } from '@shared/data';

export type ClassroomStatus = 'available' | 'in-use';

// 後方互換性のためのエクスポート
export interface ClassroomInfo extends Classroom {}

interface ClassroomCardProps {
  classroom: Classroom | ClassroomInfo;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom }) => {
  const isAvailable = classroom.status === 'available';
  const statusColor = isAvailable ? 'bg-status-available' : 'bg-status-in-use';
  const statusText = isAvailable ? '現在利用できます' : `使用中：${classroom.className || '授業名'}`;

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-5 sm:p-6 border border-gray-100 hover:border-ynu-blue/20 relative overflow-hidden animate-fadeInUp">
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 w-full h-1 ${statusColor}`}></div>
      
      {/* Room Number with icon */}
      <div className="mb-5">
        <h3 className="text-3xl sm:text-4xl font-bold text-ynu-blue mb-2 flex items-center gap-2">
          <div className="w-1 h-8 bg-ynu-blue rounded-full"></div>
          {classroom.roomNumber}
        </h3>
        <div className="flex items-center gap-2">
          <div className={`${statusColor} h-1.5 w-16 rounded-full animate-pulse-subtle`}></div>
          <span className={`text-sm font-semibold ${isAvailable ? 'text-status-available' : 'text-status-in-use'}`}>
            {statusText}
          </span>
        </div>
      </div>

      {/* Capacity and Features */}
      <div className="space-y-4">
        {/* Capacity */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5 text-ynu-blue" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">定員</p>
            <p className="text-base font-bold text-gray-900">
              {classroom.capacity}名
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="flex items-center gap-3">
          {classroom.hasProjector && (
            <div
              className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 hover:scale-110 shadow-sm"
              title="プロジェクター"
            >
              <Projector className="w-5 h-5 text-blue-600" />
            </div>
          )}
          {classroom.hasWifi && (
            <div
              className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 hover:scale-110 shadow-sm"
              title="Wi-Fi"
            >
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
          )}
          {classroom.hasPowerOutlets && (
            <div
              className="flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-200 hover:scale-110 shadow-sm"
              title="電源コンセント"
            >
              <Plug className="w-5 h-5 text-amber-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomCard;
