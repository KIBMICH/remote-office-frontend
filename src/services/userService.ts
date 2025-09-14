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
  updateMe: async (payload: UpdateUserPayload) => {
    const { data } = await api.put<UserResponse>(API_ENDPOINTS.USERS.UPDATE, payload);
    return data;
  },
  uploadAvatar: async (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    const { data } = await api.patch<UserResponse>(API_ENDPOINTS.USERS.AVATAR, form, {
      headers: { /* let browser set Content-Type boundary automatically */ },
    });
    return data;
  },
};

export default userService;
