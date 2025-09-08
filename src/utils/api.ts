import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
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
