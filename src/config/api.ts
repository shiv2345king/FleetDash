export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const API_ROUTES = {
  vehicles: {
    latest: `${API_BASE_URL}/api/vehicles/latest`,
  },
  geofence: {
    list: `${API_BASE_URL}/api/geofence`,
    alerts: `${API_BASE_URL}/api/geofence/alerts`,
  },
} as const;

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}