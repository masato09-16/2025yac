/**
 * Search history API client
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SearchHistory {
  id: string;
  faculty: string | null;
  building_id: string | null;
  status: string | null;
  search_mode: string;
  target_date: string | null;
  target_period: number | null;
  created_at: string;
}

export interface SearchHistoryCreate {
  faculty?: string | null;
  building_id?: string | null;
  status?: string | null;
  search_mode: 'now' | 'future';
  target_date?: string | null;
  target_period?: number | null;
}

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Get user's search history
 */
export async function getSearchHistory(limit: number = 20): Promise<SearchHistory[]> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/search-history/?token=${token}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error('Failed to get search history');
  }
  return response.json();
}

/**
 * Save search history
 */
export async function saveSearchHistory(history: SearchHistoryCreate): Promise<SearchHistory> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/search-history/?token=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(history),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to save search history');
  }
  return response.json();
}

/**
 * Delete search history entry
 */
export async function deleteSearchHistory(historyId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/search-history/${historyId}?token=${token}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error('Failed to delete search history');
  }
}

/**
 * Clear all search history
 */
export async function clearSearchHistory(): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(
    `${API_BASE_URL}/api/v1/search-history/?token=${token}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error('Failed to clear search history');
  }
}

