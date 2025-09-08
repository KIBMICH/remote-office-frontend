"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";

interface User {
  id: string;
  email: string;
  name?: string;
  company?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { login: authLogin, logout: authLogout } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const fetchProfile = async () => {
      try {
        if (!token) return;
        const res = await api.get(API_ENDPOINTS.USER.PROFILE);
        const data = (res as any)?.data;
        const profile = data?.user ?? data;
        if (profile) {
          // Normalize to our User shape
          const normalized: User = {
            id: profile._id?.$oid || profile._id || profile.id || "",
            email: profile.email,
            name: profile.name,
            company: profile.company,
          };
          setUser(normalized);
        }
      } catch (e) {
        // If profile fetch fails, assume logged out
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authLogin(email, password);
      if (response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
