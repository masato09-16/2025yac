import React from 'react';
import { Users, Wifi, Plug, Projector } from 'lucide-react';

export type ClassroomStatus = 'available' | 'in-use';

export interface ClassroomInfo {
  id: string;
  roomNumber: string;
  status: ClassroomStatus;
  className?: string;
  capacity: number;
  hasProjector: boolean;
  hasWifi: boolean;
  hasPowerOutlets: boolean;
}

interface ClassroomCardProps {
  classroom: ClassroomInfo;
}

export const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom }) => {
  const isAvailable = classroom.status === 'available';
  const statusColor = isAvailable ? 'bg-status-available' : 'bg-status-in-use';
  const statusText = isAvailable ? '現在利用できます' : `使用中：${classroom.className || '授業名'}`;

  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-lg transition-shadow p-4 sm:p-6">
      {/* Room Number */}
      <h3 className="text-2xl sm:text-3xl font-bold text-ynu-blue mb-4">
        {classroom.roomNumber}
      </h3>

      {/* Status Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`${statusColor} h-1 w-8 rounded-full`}></div>
        <span className={`text-sm font-medium ${isAvailable ? 'text-status-available' : 'text-status-in-use'}`}>
          {statusText}
        </span>
      </div>

      {/* Capacity and Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Capacity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">定員</p>
            <p className="text-sm sm:text-base font-semibold text-gray-900">
              {classroom.capacity}名
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-2">
          {classroom.hasProjector && (
            <div
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="プロジェクター"
            >
              <Projector className="w-4 h-4 text-gray-600" />
            </div>
          )}
          {classroom.hasWifi && (
            <div
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="Wi-Fi"
            >
              <Wifi className="w-4 h-4 text-gray-600" />
            </div>
          )}
          {classroom.hasPowerOutlets && (
            <div
              className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="電源コンセント"
            >
              <Plug className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassroomCard;
