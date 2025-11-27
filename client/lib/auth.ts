/**
 * Authentication API client
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  authorization_url: string;
}

/**
 * Get Google OAuth login URL
 */
export async function getLoginUrl(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `Failed to get login URL: ${response.status}`);
    }
    const data: AuthResponse = await response.json();
    if (!data.authorization_url) {
      throw new Error('No authorization URL returned');
    }
    return data.authorization_url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get login URL');
  }
}

/**
 * Get current user information
 */
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me?token=${token}`);
  if (!response.ok) {
    throw new Error('Failed to get user information');
  }
  return response.json();
}

/**
 * Logout user
 */
export async function logout(token: string): Promise<void> {
  await fetch(`${API_BASE_URL}/api/v1/auth/logout?token=${token}`, {
    method: 'POST',
  });
}

/**
 * Store token in localStorage
 */
export function saveToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Remove token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem('auth_token');
}

