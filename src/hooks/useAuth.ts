import { useState } from "react";
import api from "../utils/api";
import { LoginResponse } from "../types";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      const data = res.data as LoginResponse;
      localStorage.setItem("token", data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { login, logout, loading };
};
