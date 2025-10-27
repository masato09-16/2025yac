/**
 * YNU教室データ
 */

import type { Classroom } from './data';

/**
 * 実教室データを生成
 * 実際のフロアマップに基づいて作成
 */
export const ALL_CLASSROOMS: Classroom[] = [
  // ============= 教育学部 =============
  
  // 教育学部講義棟6号館
  { id: 'edu6-101', roomNumber: '6-101', buildingId: 'edu-6', faculty: 'education', floor: 1, status: 'available', capacity: 60, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu6-102', roomNumber: '6-102', buildingId: 'edu-6', faculty: 'education', floor: 1, status: 'available', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu6-201', roomNumber: '6-201', buildingId: 'edu-6', faculty: 'education', floor: 2, status: 'in-use', className: '教育心理学', capacity: 70, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // 教育学部講義棟7号館・化学実験室
  { id: 'edu7-101', roomNumber: '7-101', buildingId: 'edu-7', faculty: 'education', floor: 1, status: 'available', capacity: 50, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-102a', roomNumber: '7-102A', buildingId: 'edu-7', faculty: 'education', floor: 1, status: 'available', capacity: 30, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-103', roomNumber: '7-103', buildingId: 'edu-7', faculty: 'education', floor: 1, status: 'available', capacity: 40, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-104', roomNumber: '7-104', buildingId: 'edu-7', faculty: 'education', floor: 1, status: 'in-use', className: '化学実験', capacity: 25, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-201', roomNumber: '7-201', buildingId: 'edu-7', faculty: 'education', floor: 2, status: 'available', capacity: 60, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-202', roomNumber: '7-202', buildingId: 'edu-7', faculty: 'education', floor: 2, status: 'available', capacity: 65, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-203', roomNumber: '7-203', buildingId: 'edu-7', faculty: 'education', floor: 2, status: 'available', capacity: 60, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'edu7-210', roomNumber: '7-210', buildingId: 'edu-7', faculty: 'education', floor: 2, status: 'in-use', className: '化学実験A', capacity: 20, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-211', roomNumber: '7-211', buildingId: 'edu-7', faculty: 'education', floor: 2, status: 'available', capacity: 20, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-301', roomNumber: '7-301', buildingId: 'edu-7', faculty: 'education', floor: 3, status: 'available', capacity: 55, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-302', roomNumber: '7-302', buildingId: 'edu-7', faculty: 'education', floor: 3, status: 'available', capacity: 55, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-305', roomNumber: '7-305', buildingId: 'edu-7', faculty: 'education', floor: 3, status: 'in-use', className: '教育方法学', capacity: 50, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-306', roomNumber: '7-306', buildingId: 'edu-7', faculty: 'education', floor: 3, status: 'available', capacity: 50, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu7-307', roomNumber: '7-307', buildingId: 'edu-7', faculty: 'education', floor: 3, status: 'available', capacity: 45, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'edu7-308', roomNumber: '7-308', buildingId: 'edu-7', faculty: 'education', floor: 3, status: 'available', capacity: 45, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  
  // 教育学部講義棟8号館
  { id: 'edu8-101', roomNumber: '8-101', buildingId: 'edu-8', faculty: 'education', floor: 1, status: 'available', capacity: 90, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-102', roomNumber: '8-102', buildingId: 'edu-8', faculty: 'education', floor: 1, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-103', roomNumber: '8-103', buildingId: 'edu-8', faculty: 'education', floor: 1, status: 'in-use', className: '特別支援教育', capacity: 75, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-104', roomNumber: '8-104', buildingId: 'edu-8', faculty: 'education', floor: 1, status: 'available', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-105', roomNumber: '8-105', buildingId: 'edu-8', faculty: 'education', floor: 1, status: 'available', capacity: 75, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'edu8-106', roomNumber: '8-106', buildingId: 'edu-8', faculty: 'education', floor: 1, status: 'available', capacity: 70, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-201', roomNumber: '8-201', buildingId: 'edu-8', faculty: 'education', floor: 2, status: 'available', capacity: 90, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-202', roomNumber: '8-202', buildingId: 'edu-8', faculty: 'education', floor: 2, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-203', roomNumber: '8-203', buildingId: 'edu-8', faculty: 'education', floor: 2, status: 'in-use', className: '教育社会学', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-204', roomNumber: '8-204', buildingId: 'edu-8', faculty: 'education', floor: 2, status: 'available', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'edu8-205', roomNumber: '8-205', buildingId: 'edu-8', faculty: 'education', floor: 2, status: 'available', capacity: 75, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'edu8-206', roomNumber: '8-206', buildingId: 'edu-8', faculty: 'education', floor: 2, status: 'available', capacity: 70, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // ============= 理工学部 =============
  
  // 理工学部講義棟A・物理実験室
  { id: 'eng-a-101', roomNumber: 'A-101', buildingId: 'eng-a', faculty: 'engineering', floor: 1, status: 'available', capacity: 60, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-102', roomNumber: 'A-102', buildingId: 'eng-a', faculty: 'engineering', floor: 1, status: 'available', capacity: 65, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-104', roomNumber: 'A-104', buildingId: 'eng-a', faculty: 'engineering', floor: 1, status: 'in-use', className: '物理学基礎', capacity: 70, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-105', roomNumber: 'A-105', buildingId: 'eng-a', faculty: 'engineering', floor: 1, status: 'available', capacity: 60, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-201', roomNumber: 'A-201', buildingId: 'eng-a', faculty: 'engineering', floor: 2, status: 'available', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-202', roomNumber: 'A-202', buildingId: 'eng-a', faculty: 'engineering', floor: 2, status: 'available', capacity: 75, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-203', roomNumber: 'A-203', buildingId: 'eng-a', faculty: 'engineering', floor: 2, status: 'available', capacity: 70, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'eng-a-204', roomNumber: 'A-204', buildingId: 'eng-a', faculty: 'engineering', floor: 2, status: 'available', capacity: 65, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-206', roomNumber: 'A-206', buildingId: 'eng-a', faculty: 'engineering', floor: 2, status: 'in-use', className: '数学解析学', capacity: 60, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-301', roomNumber: 'A-301', buildingId: 'eng-a', faculty: 'engineering', floor: 3, status: 'available', capacity: 30, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-302', roomNumber: 'A-302', buildingId: 'eng-a', faculty: 'engineering', floor: 3, status: 'available', capacity: 30, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-303', roomNumber: 'A-303', buildingId: 'eng-a', faculty: 'engineering', floor: 3, status: 'available', capacity: 30, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-304', roomNumber: 'A-304', buildingId: 'eng-a', faculty: 'engineering', floor: 3, status: 'in-use', className: '物理実験A', capacity: 25, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-305', roomNumber: 'A-305', buildingId: 'eng-a', faculty: 'engineering', floor: 3, status: 'available', capacity: 25, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-a-306', roomNumber: 'A-306', buildingId: 'eng-a', faculty: 'engineering', floor: 3, status: 'available', capacity: 25, hasProjector: false, hasWifi: true, hasPowerOutlets: true },
  
  // 理工学部講義棟B
  { id: 'eng-b-201', roomNumber: 'B-201', buildingId: 'eng-b', faculty: 'engineering', floor: 2, status: 'available', capacity: 90, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-b-202', roomNumber: 'B-202', buildingId: 'eng-b', faculty: 'engineering', floor: 2, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-b-graphic', roomNumber: 'B-グラフィック演習室', buildingId: 'eng-b', faculty: 'engineering', floor: 1, status: 'in-use', className: 'CG演習', capacity: 30, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // 理工学部講義棟C
  { id: 'eng-c-101', roomNumber: 'C-101', buildingId: 'eng-c', faculty: 'engineering', floor: 1, status: 'available', capacity: 100, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-c-102', roomNumber: 'C-102', buildingId: 'eng-c', faculty: 'engineering', floor: 1, status: 'available', capacity: 100, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-c-201', roomNumber: 'C-201', buildingId: 'eng-c', faculty: 'engineering', floor: 2, status: 'in-use', className: '化学実験', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'eng-c-301', roomNumber: 'C-301', buildingId: 'eng-c', faculty: 'engineering', floor: 3, status: 'available', capacity: 90, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // ============= 経済学部 =============
  
  // 経済学部講義棟1号館
  { id: 'econ1-101', roomNumber: '経済1-101', buildingId: 'econ-1', faculty: 'economics', floor: 1, status: 'available', capacity: 120, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-102', roomNumber: '経済1-102', buildingId: 'econ-1', faculty: 'economics', floor: 1, status: 'available', capacity: 110, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-103', roomNumber: '経済1-103', buildingId: 'econ-1', faculty: 'economics', floor: 1, status: 'available', capacity: 105, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'econ1-104', roomNumber: '経済1-104', buildingId: 'econ-1', faculty: 'economics', floor: 1, status: 'in-use', className: '経済学原論', capacity: 100, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-105', roomNumber: '経済1-105', buildingId: 'econ-1', faculty: 'economics', floor: 1, status: 'available', capacity: 95, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-201', roomNumber: '経済1-201', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'available', capacity: 120, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-202', roomNumber: '経済1-202', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'available', capacity: 115, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-203', roomNumber: '経済1-203', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'available', capacity: 110, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-204', roomNumber: '経済1-204', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'in-use', className: 'マクロ経済学', capacity: 105, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-205', roomNumber: '経済1-205', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'available', capacity: 100, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'econ1-206', roomNumber: '経済1-206', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'available', capacity: 95, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ1-207', roomNumber: '経済1-207', buildingId: 'econ-1', faculty: 'economics', floor: 2, status: 'available', capacity: 90, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // 経済学部講義棟2号館
  { id: 'econ2-211', roomNumber: '経済2-211', buildingId: 'econ-2', faculty: 'economics', floor: 1, status: 'available', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'econ2-212', roomNumber: '経済2-212', buildingId: 'econ-2', faculty: 'economics', floor: 1, status: 'available', capacity: 75, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // ============= 経営学部 =============
  
  // 経営学部講義棟1号館
  { id: 'bus1-101', roomNumber: '経営1-101', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 130, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-102', roomNumber: '経営1-102', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 125, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-103', roomNumber: '経営1-103', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 120, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'bus1-104', roomNumber: '経営1-104', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 115, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-105', roomNumber: '経営1-105', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'in-use', className: '経営学原論', capacity: 110, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-106', roomNumber: '経営1-106', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 105, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-107', roomNumber: '経営1-107', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 100, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-108', roomNumber: '経営1-108', buildingId: 'bus-1', faculty: 'business', floor: 1, status: 'available', capacity: 95, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'bus1-201', roomNumber: '経営1-201', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'available', capacity: 130, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-202', roomNumber: '経営1-202', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'available', capacity: 125, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-203', roomNumber: '経営1-203', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'in-use', className: '管理会計論', capacity: 120, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-204', roomNumber: '経営1-204', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'available', capacity: 115, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-205', roomNumber: '経営1-205', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'available', capacity: 110, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus1-206', roomNumber: '経営1-206', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'available', capacity: 105, hasProjector: true, hasWifi: true, hasPowerOutlets: false },
  { id: 'bus1-207', roomNumber: '経営1-207', buildingId: 'bus-1', faculty: 'business', floor: 2, status: 'available', capacity: 100, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // 経営学部講義棟2号館
  { id: 'bus2-109', roomNumber: '経営2-109', buildingId: 'bus-2', faculty: 'business', floor: 1, status: 'available', capacity: 150, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-208', roomNumber: '経営2-208', buildingId: 'bus-2', faculty: 'business', floor: 2, status: 'available', capacity: 140, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-201', roomNumber: '経営2-201 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 2, status: 'in-use', className: 'ゼミ', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-202', roomNumber: '経営2-202 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 2, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-203', roomNumber: '経営2-203 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 2, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-204', roomNumber: '経営2-204 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 2, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-331', roomNumber: '経営2-331 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 3, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-332', roomNumber: '経営2-332 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 3, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-333', roomNumber: '経営2-333 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 3, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'bus2-334', roomNumber: '経営2-334 ゼミ室', buildingId: 'bus-2', faculty: 'business', floor: 3, status: 'available', capacity: 20, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  
  // ============= 都市科学部 =============
  // (教育学部講義棟8号館と共用)
  { id: 'urban-101', roomNumber: '都市-101', buildingId: 'urban-8', faculty: 'urban-sciences', floor: 1, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'urban-102', roomNumber: '都市-102', buildingId: 'urban-8', faculty: 'urban-sciences', floor: 1, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'urban-103', roomNumber: '都市-103', buildingId: 'urban-8', faculty: 'urban-sciences', floor: 1, status: 'in-use', className: '都市計画概論', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'urban-201', roomNumber: '都市-201', buildingId: 'urban-8', faculty: 'urban-sciences', floor: 2, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'urban-202', roomNumber: '都市-202', buildingId: 'urban-8', faculty: 'urban-sciences', floor: 2, status: 'available', capacity: 85, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
  { id: 'urban-203', roomNumber: '都市-203', buildingId: 'urban-8', faculty: 'urban-sciences', floor: 2, status: 'available', capacity: 80, hasProjector: true, hasWifi: true, hasPowerOutlets: true },
];

