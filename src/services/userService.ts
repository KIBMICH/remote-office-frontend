import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
  avatarUrl?: string;
  timezone?: string;
  language?: string;
  status?: string;
  country?: string;
  address?: string;
};

export type UserResponse = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
  avatarUrl?: string;
  timezone?: string;
  language?: string;
  status?: string;
  country?: string;
  address?: string;
};

export const userService = {
  getMe: async () => {
    const { data } = await api.get<UserResponse>("users/me");
    return data;
  },
  updateMe: async (payload: UpdateUserPayload) => {
    const { data } = await api.put<UserResponse>(API_ENDPOINTS.USERS.UPDATE, payload);
    return data;
  },
  uploadAvatar: async (file: File) => {
    try {
    
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      const form = new FormData();
      form.append("avatar", file);
      
      
      // Check if token exists
      const token = localStorage.getItem("token");
      
      
      // Log the full URL being called
      
      
      
      // Use PATCH method as specified in API documentation with extended timeout for file upload
      const { data } = await api.patch<UserResponse>("users/avatar", form, {
        headers: {
          // Explicitly remove Content-Type to let browser set it with boundary
          'Content-Type': undefined,
          // Authorization header is automatically added by axios interceptor
        },
        timeout: 60000, // 60 seconds for file upload
      });
    
      return data;
    } catch (err: unknown) {
      // Narrow unknown error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      console.error('Avatar upload failed:', error);
      if (error?.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
        console.error('Response status text:', error.response.statusText);
        
        // Log specific error message if available
        if (error.response.data?.message) {
          console.error('Backend error message:', error.response.data.message);
        }
        if (error.response.data?.error) {
          console.error('Backend error details:', error.response.data.error);
        }
      }
      if (error?.request) {
        console.error('Request details:', error.request);
      }
      if (error?.config) console.error('Error config:', error.config);
      if (error?.message) console.error('Error message:', error.message);
      throw error;
    }
  },
};

export default userService;
