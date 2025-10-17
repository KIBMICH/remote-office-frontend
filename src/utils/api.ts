import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increased to 30 seconds for slower connections
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const c = config as { headers?: Record<string, string> };
      if (!c.headers) c.headers = {};
      c.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
// Small helper for backoff delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status as number | undefined;

    if (status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
      return Promise.reject(error);
    }

    // Automatic retry for rate limits and transient errors on idempotent GET requests
    const shouldRetry = status === 429 || status === 503 || status === 502; // rate limit / service unavailable / bad gateway
    const originalConfig = ((error.config || {}) as Record<string, unknown>) as Record<string, unknown> & { url?: string; method?: string; __retryCount?: number };

    if (shouldRetry && originalConfig && (originalConfig.method || '').toLowerCase() === 'get' && originalConfig.url) {
      originalConfig.__retryCount = (originalConfig.__retryCount || 0) + 1;
      const maxRetries = 3;

      if (originalConfig.__retryCount <= maxRetries) {
        const base = 500; // 0.5s base
        const backoff = base * Math.pow(2, originalConfig.__retryCount - 1);
        const jitter = Math.floor(Math.random() * 250); // add 0-250ms jitter
        const waitMs = backoff + jitter;

        console.warn(`Retrying request due to ${status} (attempt ${originalConfig.__retryCount}/${maxRetries}) in ${waitMs}ms`);
        await delay(waitMs);
        return api.request(originalConfig as Parameters<typeof api.request>[0]);
      }
    }

    // Enhanced error handling for timeouts and network issues
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('Request timeout - check your network connection or backend availability');
    }

    if (!error.response && error.request) {
      console.error('Network error - unable to reach the server');
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiClient = {
  get: <T = unknown>(url: string, config?: Record<string, unknown>) => api.get<T>(url, config),
  post: <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>) => api.post<T>(url, data, config),
  put: <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>) => api.put<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: Record<string, unknown>) => api.delete<T>(url, config),
  patch: <T = unknown>(url: string, data?: unknown, config?: Record<string, unknown>) => api.patch<T>(url, data, config),
};

export default api;
