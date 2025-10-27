/**
 * YNU学部・教室データ
 */

// 学部の種類
export type Faculty = 'education' | 'engineering' | 'economics' | 'business' | 'urban-sciences';

// 学部の日本語名とショートネームのマッピング
export const FACULTY_NAMES: Record<Faculty, { short: string; full: string }> = {
  'education': { short: '教養', full: '教育学部' },
  'engineering': { short: '理工', full: '理工学部' },
  'economics': { short: '経済', full: '経済学部' },
  'business': { short: '経営', full: '経営学部' },
  'urban-sciences': { short: '都市', full: '都市科学部' },
};

// 建物情報
export interface Building {
  id: string;
  name: string;
  faculty: Faculty;
  floors: number[];
}

// 教室情報
export interface Classroom {
  id: string;
  roomNumber: string;
  buildingId: string;
  faculty: Faculty;
  floor: number;
  status: 'available' | 'in-use';
  className?: string;
  capacity: number;
  hasProjector: boolean;
  hasWifi: boolean;
  hasPowerOutlets: boolean;
}

// 建物マスターデータ
export const BUILDINGS: Building[] = [
  // 教育学部
  { id: 'edu-6', name: '教育学部講義棟6号館', faculty: 'education', floors: [1, 2] },
  { id: 'edu-7', name: '教育学部講義棟7号館・化学実験室', faculty: 'education', floors: [1, 2, 3] },
  { id: 'edu-8', name: '教育学部講義棟8号館', faculty: 'education', floors: [1, 2] },
  
  // 理工学部
  { id: 'eng-a', name: '理工学部講義棟A・物理実験室', faculty: 'engineering', floors: [1, 2, 3] },
  { id: 'eng-b', name: '理工学部講義棟B', faculty: 'engineering', floors: [1, 2] },
  { id: 'eng-c', name: '理工学部講義棟C', faculty: 'engineering', floors: [1, 2, 3] },
  
  // 経済学部
  { id: 'econ-1', name: '経済学部講義棟1号館', faculty: 'economics', floors: [1, 2] },
  { id: 'econ-2', name: '経済学部講義棟2号館', faculty: 'economics', floors: [1, 2] },
  
  // 経営学部
  { id: 'bus-1', name: '経営学部講義棟1号館', faculty: 'business', floors: [1, 2] },
  { id: 'bus-2', name: '経営学部講義棟2号館', faculty: 'business', floors: [1, 2, 3] },
  
  // 都市科学部（教育学部講義棟8号館と共用）
  { id: 'urban-8', name: '都市科学部講義棟', faculty: 'urban-sciences', floors: [1, 2] },
];

