/**
 * API client for FastAPI backend
 */

// In Vercel/production, use relative paths (same domain)
// In development, use localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:8000');

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Types from FastAPI backend
export interface Classroom {
  id: string;
  room_number: string;
  building_id: string;
  faculty: string;
  floor: number;
  capacity: number;
  has_projector: boolean;
  has_wifi: boolean;
  has_power_outlets: boolean;
}

export interface Occupancy {
  id: number;
  classroom_id: string;
  current_count: number;
  detection_confidence: number;
  last_updated: string;
  camera_id?: string;
}

export interface ActiveClass {
  class_name: string;
  instructor?: string;
  start_time: string;
  end_time: string;
}

export interface ClassroomWithStatus {
  classroom: Classroom;
  occupancy: Occupancy | null;
  is_available: boolean;
  occupancy_rate: number;
  status: string;  // "available", "in-class", "occupied", "partially-occupied", "scheduled-low"
  status_detail: string;
  active_class?: ActiveClass;
  image_url?: string;  // 解析結果画像のURL
}

export interface ClassSchedule {
  id: string;
  classroom_id: string;
  class_name: string;
  instructor?: string;
  day_of_week: number;
  period: number;
  start_time: string;
  end_time: string;
  semester?: string;
  course_code?: string;
}

export interface ClassScheduleCreate {
  classroom_id: string;
  class_name: string;
  instructor?: string;
  day_of_week: number;
  period: number;
  start_time: string;
  end_time: string;
  semester?: string;
  course_code?: string;
}

export interface ClassScheduleUpdate {
  class_name?: string;
  instructor?: string;
  day_of_week?: number;
  period?: number;
  start_time?: string;
  end_time?: string;
  semester?: string;
  course_code?: string;
}

/**
 * Fetch all classrooms
 */
export async function getClassrooms(params?: {
  faculty?: string;
  building_id?: string;
  floor?: number;
}): Promise<Classroom[]> {
  const queryParams = new URLSearchParams();
  if (params?.faculty) queryParams.append('faculty', params.faculty);
  if (params?.building_id) queryParams.append('building_id', params.building_id);
  if (params?.floor) queryParams.append('floor', params.floor.toString());

  const query = queryParams.toString();
  const endpoint = `/api/v1/classrooms${query ? `?${query}` : ''}`;

  return fetchAPI<Classroom[]>(endpoint);
}

/**
 * Fetch classroom with occupancy status
 */
export async function getClassroomsWithStatus(params?: {
  faculty?: string;
  building_id?: string;
  available_only?: boolean;
  target_date?: string; // YYYY-MM-DD format
  target_period?: number; // 1-5
}): Promise<ClassroomWithStatus[]> {
  const queryParams = new URLSearchParams();
  if (params?.faculty) queryParams.append('faculty', params.faculty);
  if (params?.building_id) queryParams.append('building_id', params.building_id);
  if (params?.available_only) queryParams.append('available_only', 'true');
  if (params?.target_date) queryParams.append('target_date', params.target_date);
  if (params?.target_period) queryParams.append('target_period', params.target_period.toString());

  const query = queryParams.toString();
  const endpoint = `/api/v1/occupancy/classrooms-with-status${query ? `?${query}` : ''}`;

  return fetchAPI<ClassroomWithStatus[]>(endpoint);
}

/**
 * Fetch occupancy for all classrooms
 */
export async function getAllOccupancy(params?: {
  faculty?: string;
  building_id?: string;
  available_only?: boolean;
}): Promise<Occupancy[]> {
  const queryParams = new URLSearchParams();
  if (params?.faculty) queryParams.append('faculty', params.faculty);
  if (params?.building_id) queryParams.append('building_id', params.building_id);
  if (params?.available_only) queryParams.append('available_only', 'true');

  // キャッシュを防ぐためにタイムスタンプを追加
  queryParams.append('_t', Date.now().toString());

  const query = queryParams.toString();
  const endpoint = `/api/v1/occupancy${query ? `?${query}` : ''}`;

  return fetchAPI<Occupancy[]>(endpoint);
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string; camera_enabled: boolean }> {
  return fetchAPI<{ status: string; camera_enabled: boolean }>('/health');
}

/**
 * Schedule API functions
 */

/**
 * Fetch all schedules
 */
export async function getSchedules(params?: {
  classroom_id?: string;
  day_of_week?: number;
  period?: number;
}): Promise<ClassSchedule[]> {
  const queryParams = new URLSearchParams();
  if (params?.classroom_id) queryParams.append('classroom_id', params.classroom_id);
  if (params?.day_of_week !== undefined) queryParams.append('day_of_week', params.day_of_week.toString());
  if (params?.period) queryParams.append('period', params.period.toString());

  const query = queryParams.toString();
  const endpoint = `/api/v1/schedules/${query ? `?${query}` : ''}`;

  return fetchAPI<ClassSchedule[]>(endpoint);
}

/**
 * Fetch active schedules
 */
export async function getActiveSchedules(currentTime?: string): Promise<ClassSchedule[]> {
  const queryParams = new URLSearchParams();
  if (currentTime) queryParams.append('current_time', currentTime);

  const query = queryParams.toString();
  const endpoint = `/api/v1/schedules/active${query ? `?${query}` : ''}`;

  return fetchAPI<ClassSchedule[]>(endpoint);
}

/**
 * Fetch a specific schedule
 */
export async function getSchedule(scheduleId: string): Promise<ClassSchedule> {
  return fetchAPI<ClassSchedule>(`/api/v1/schedules/${scheduleId}`);
}

/**
 * Create a new schedule
 */
export async function createSchedule(data: ClassScheduleCreate): Promise<ClassSchedule> {
  return fetchAPI<ClassSchedule>('/api/v1/schedules/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update a schedule
 */
export async function updateSchedule(scheduleId: string, data: ClassScheduleUpdate): Promise<ClassSchedule> {
  return fetchAPI<ClassSchedule>(`/api/v1/schedules/${scheduleId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(scheduleId: string): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`/api/v1/schedules/${scheduleId}`, {
    method: 'DELETE',
  });
}

