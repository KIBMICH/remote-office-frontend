"use client";
import { useState, useEffect } from "react";
import { User, getCurrentUser } from "../lib/auth";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (!mounted) return;
      setUser(u);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
