/**
 * Core API client for making HTTP requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

/**
 * Fetch wrapper with error handling and automatic JSON parsing
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = options;

  // Build URL with query parameters
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    Object.keys(params).forEach(key => 
      url.searchParams.append(key, params[key])
    );
  }

  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  };

  // Request configuration
  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    credentials: 'include',
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), config);

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    // Parse JSON response, or return empty object if no content
    return await response.json() as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * HTTP method shortcuts
 */
export const apiClient = {
  get: <T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
      post: <T>(endpoint: string, body: Record<string, unknown>, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: Record<string, unknown>, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T>(endpoint: string, body: Record<string, unknown>, options: Omit<RequestOptions, 'method' | 'body'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
