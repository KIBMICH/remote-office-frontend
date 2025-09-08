import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  [key: string]: unknown;
};

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return data;
  },
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
    return data;
  },
};

export default authService;
