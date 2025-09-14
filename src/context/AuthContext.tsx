"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/api";

interface User {
  id: string;
  email: string;
  name?: string;
  company?: unknown;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
  timezone?: string;
  language?: string;
  status?: string;
  country?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
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
        if (!token) {
          console.log('No token found, skipping profile fetch');
          return;
        }
        console.log('Token found, fetching profile...');
        const res = await api.get('api/users/me');
        type RawId = string | { $oid?: string } | undefined;
        type RawProfile = { _id?: RawId; id?: string; email: string; name?: string; company?: unknown };
        type ApiProfile = { user?: RawProfile } | RawProfile;
        const data = (res as { data?: ApiProfile }).data;
        const profile: RawProfile | undefined = (data && 'user' in data ? data.user : data) as RawProfile | undefined;
        if (profile) {
          
          // Normalize to our User shape
          const profileData = profile as Record<string, unknown>;
          const normalized: User = {
            id: (typeof profile._id === 'object' ? profile._id?.$oid : profile._id) || profile.id || "",
            email: profile.email,
            name: profile.name,
            company: profile.company,
            avatarUrl: profileData.avatarUrl as string,
            firstName: profileData.firstName as string,
            lastName: profileData.lastName as string,
            phone: profileData.phone as string,
            jobTitle: profileData.jobTitle as string,
            timezone: profileData.timezone as string,
            language: profileData.language as string,
            status: profileData.status as string,
            country: profileData.country as string,
          };
          setUser(normalized);
        }
      } catch (error) {
        // If profile fetch fails, assume logged out
        console.error('Profile fetch failed:', error);
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
