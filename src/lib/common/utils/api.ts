const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface ApiError {
  error: string;
  statusCode?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const hasBody = response.status !== 204 && response.status !== 205;

  const parseBody = async () => {
    if (!hasBody) return null;
    if (contentType.includes('application/json')) {
      return response.json();
    }
    const text = await response.text();
    return text || null;
  };

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }

    const errorBody = await parseBody().catch(() => null);
    const message =
      (errorBody && typeof errorBody === 'object' && 'error' in errorBody && (errorBody as any).error) ||
      (typeof errorBody === 'string' && errorBody) ||
      `HTTP ${response.status}`;
    throw new Error(message);
  }

  return (await parseBody()) as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

