"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";
import { useAuthContext } from "@/context/AuthContext";
import Spinner from "@/components/ui/Spinner";

function AuthCallbackCore() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // First, try to get token from URL parameters
        let token = params.get("token") || params.get("access_token") || params.get("accessToken");
        
        // Fallback: sometimes providers put tokens in the hash fragment
        if (!token && typeof window !== "undefined" && window.location.hash) {
          const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          token = hash.get("token") || hash.get("access_token") || hash.get("accessToken");
        }

        // If no token in URL, check if the page body contains JSON (your backend's behavior)
        if (!token && typeof window !== "undefined") {
          const bodyText = document.body.innerText || document.body.textContent || '';
          
          // Check if the page contains JSON with token
          if (bodyText.includes('"token"') && bodyText.includes('"message":"Google login successful"')) {
            try {
              const data = JSON.parse(bodyText);
              if (data.token && data.user) {
                // If this is a popup window, send message to parent
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'GOOGLE_AUTH_SUCCESS',
                    token: data.token,
                    user: data.user
                  }, window.location.origin);
                  window.close();
                  return;
                }
                
                // Otherwise, handle normally (non-popup)
                token = data.token;
                localStorage.setItem("token", token!);

                const normalized = {
                  id: data.user.id || "",
                  email: data.user.email || "",
                  name: data.user.name,
                  company: data.user.company,
                };
                setUser(normalized);

                const extractId = (val: unknown): string | null => {
                  if (!val) return null;
                  if (typeof val === 'string') return val;
                  if (typeof val === 'object') {
                    const v = val as { _id?: string; $oid?: string };
                    return v._id ?? v.$oid ?? null;
                  }
                  return null;
                };
                const companyId = extractId(normalized.company);
                console.log('[AuthCallback] Inline JSON flow companyId:', companyId, 'raw company:', normalized.company);
                router.replace(companyId ? "/dashboard" : "/job-marketplace");
                return;
              }
            } catch (e) {
              console.error("Failed to parse JSON from page body:", e);
            }
          }
        }

        if (!token) {
          setError("No authentication token found. Please try signing in again.");
          setTimeout(() => {
            router.replace("/sign-in");
          }, 3000);
          return;
        }

        // Standard token processing
        localStorage.setItem("token", token);

        // Fetch profile to populate context (with fallbacks to handle differing backend routes)
        type RawId = string | { $oid?: string } | undefined;
        type RawProfile = { _id?: RawId; id?: string; email: string; name?: string; company?: unknown };

        const tryEndpoints = async (): Promise<RawProfile | undefined> => {
          const endpoints = [
            API_ENDPOINTS.USER.PROFILE,
            'api/auth/profile',
            'api/users/me',
            'api/user/me',
            'api/profile',
          ];
          for (const ep of endpoints) {
            try {
              const resp = await api.get(ep);
              const d = resp.data;
              let prof: RawProfile | undefined;
              if (d && typeof d === 'object' && 'user' in d) {
                const maybe = d as { user?: RawProfile };
                prof = maybe.user;
              } else {
                prof = d as RawProfile | undefined;
              }
              if (prof?.email) return prof;
            } catch (e: unknown) {
              type AxiosErrorLike = { response?: { status?: number } };
              const status = (e as AxiosErrorLike)?.response?.status;
              // Try next endpoint on 404, break on 401/403 or other fatal errors
              if (status && status !== 404) break;
            }
          }
          return undefined;
        };

        const profile = await tryEndpoints();
        
        if (profile) {
          const normalized = {
            id: (typeof profile._id === 'object' ? profile._id?.$oid : profile._id) || profile.id || "",
            email: profile.email,
            name: profile.name,
            company: profile.company,
          };
          setUser(normalized);
          
          // Determine redirect based on company
          const extractId = (val: unknown): string | null => {
            if (!val) return null;
            if (typeof val === 'string') return val;
            if (typeof val === 'object') {
              const v = val as { _id?: string; $oid?: string };
              return v._id ?? v.$oid ?? null;
            }
            return null;
          };
          const companyId = extractId(profile.company);
          console.log('[AuthCallback] Profile flow companyId:', companyId, 'raw company:', profile.company);
          router.replace(companyId ? "/dashboard" : "/job-marketplace");
          return;
        }
        
        // Fallback if profile not returned -> treat as no company
        console.log('[AuthCallback] No profile returned; routing to job-marketplace by default.');
        router.replace("/job-marketplace");
        
      } catch (e) {
        console.error("Callback error:", e);
        setError("Failed to complete sign-in. Please try again.");
        setTimeout(() => {
          router.replace("/sign-in");
        }, 3000);
      }
    };

    handleCallback();
  }, [params, router, setUser]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex items-center gap-3">
        <Spinner size={18} />
        <span>{error ? error : "Finalizing Google sign-in..."}</span>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3">
          <Spinner size={18} />
          <span>Preparing callback...</span>
        </div>
      </main>
    }>
      <AuthCallbackCore />
    </Suspense>
  );
}
