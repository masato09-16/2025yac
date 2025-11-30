/**
 * Favorites API client
 */
// In Vercel/production, use relative paths (same domain)
// In development, use localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:8000');

export interface Favorite {
  id: string;
  classroom_id: string;
  classroom: {
    id: string;
    room_number: string;
    building_id: string;
    faculty: string;
    floor: number;
    capacity: number;
    has_projector: boolean;
    has_wifi: boolean;
    has_power_outlets: boolean;
  };
  created_at: string;
}

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Get user's favorites
 */
export async function getFavorites(): Promise<Favorite[]> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/favorites/?token=${token}`);
  if (!response.ok) {
    throw new Error('Failed to get favorites');
  }
  return response.json();
}

/**
 * Add classroom to favorites
 */
export async function addFavorite(classroomId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/favorites/${classroomId}?token=${token}`,
    { method: 'POST' }
  );
  if (!response.ok) {
    throw new Error('Failed to add favorite');
  }
}

/**
 * Remove classroom from favorites
 */
export async function removeFavorite(classroomId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/favorites/${classroomId}?token=${token}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error('Failed to remove favorite');
  }
}

/**
 * Check if classroom is in favorites
 */
export async function checkFavorite(classroomId: string): Promise<boolean> {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/favorites/check/${classroomId}?token=${token}`
    );
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.is_favorite;
  } catch {
    return false;
  }
}

