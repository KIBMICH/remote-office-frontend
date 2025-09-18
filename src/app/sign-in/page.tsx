"use client";
import React, { useState, Suspense } from "react";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthContext } from "@/context/AuthContext";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success: toastSuccess } = useToast();
  const { login } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initiate Google OAuth via backend
  const handleGoogleSignIn = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    try {
    
      const callback = `${window.location.origin}/auth/callback`;
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?redirectUri=${encodeURIComponent(callback)}`;
      
      window.location.href = backendUrl;
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to initiate Google sign-in. Please try again.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Use AuthContext login method which handles profile data fetching
      const res = await login(email, password);
      
      toastSuccess("Login successful! Redirecting...");
      await new Promise((r) => setTimeout(r, 1000));
      
      // Extract company information for routing
      type LoginRes = { companyId?: string; company?: { _id?: string; $oid?: string } | string; user?: { company?: unknown; companyId?: string } };
      const r = res as unknown as LoginRes;
      const rawUser = r?.user;
      
      const extractId = (val: unknown): string | null => {
        if (!val) return null;
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
          const v = val as { _id?: string; $oid?: string };
          return v._id ?? v.$oid ?? null;
        }
        return null;
      };
      
      const companyId =
        extractId(rawUser?.company) ??
        rawUser?.companyId ??
        r?.companyId ??
        extractId(r?.company) ??
        null;
        
      // Get redirect URL from search params or default based on company
      const redirectUrl = searchParams.get('redirect');
      
      if (companyId) {
        router.push(redirectUrl || "/dashboard");
      } else {
        router.push("/job-marketplace");
      }
    } catch (err: unknown) {
      let message = "Login failed";
      if (typeof err === "object" && err !== null) {
        const maybeAny = err as { response?: { data?: { message?: string } }; message?: string };
        message = maybeAny.response?.data?.message || maybeAny.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center pt-10">
      {/* Top centered image/logo */}
      <div className="w-24 h-24 rounded-md overflow-hidden mb-0 shadow-lg">
        {/* Replace src with your desired image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/signup_logo.png" alt="RemoteHub" className="w-full h-full object-cover bg-black" />
      </div>

      <AuthTabs />
      <AuthCard title="Welcome Back" subtitle="Sign in to your RemoteHub account">
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V8C2 6.9 2.9 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 8L12 13L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <Input
                type="email"
                placeholder="Enter Email"
                className="pl-10 h-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <Link href="/reset-password" className="text-sm text-blue-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="•••••••"
                className="pl-10 pr-10 h-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10.58 10.73C10.21 11.1 9.99997 11.57 9.99997 12C9.99997 13.1 10.9 14 12 14C12.43 14 12.9 13.79 13.27 13.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M6.71 6.71C4.7 7.9 3.26 9.67 2.5 12C4.33 17.5 9 20 12 20C13.63 20 15.5 19.5 17.29 18.29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M14.12 9.88C13.55 9.32 12.79 9 12 9C10.9 9 10 9.9 10 11C10 11.79 10.32 12.55 10.88 13.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 4C9 4 4.33 6.5 2.5 12C3.09 13.8 4.03 15.29 5.21 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C4.5 6.5 9 4 12 4C15 4 19.5 6.5 22 12C19.5 17.5 15 20 12 20C9 20 4.5 17.5 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-10 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={16} />
                <span>Signing In...</span>
              </span>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-4">
          <div className="h-px bg-gray-700/80 flex-1" />
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px bg-gray-700/80 flex-1" />
        </div>

        <Button 
          type="button"
          onClick={handleGoogleSignIn}
          variant="secondary" 
          className="relative w-full h-10 !bg-black text-white !border !border-gray-900 hover:!bg-black/90 rounded-md font-medium"
        >
          <span className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.22 1.16-1.82 3.4-5.1 3.4-3.08 0-5.6-2.54-5.6-5.7s2.52-5.7 5.6-5.7c1.76 0 2.94.74 3.61 1.38l2.46-2.37C16.84 3.2 14.64 2.3 12 2.3 6.92 2.3 2.8 6.42 2.8 11.5S6.92 20.7 12 20.7c6.04 0 9.2-4.24 9.2-8.13 0-.55-.06-.97-.14-1.37H12z"/>
              <path fill="#34A853" d="M3.96 7.36l2.96 2.17C7.57 8.16 9.6 6.7 12 6.7c1.76 0 2.94.74 3.61 1.38l2.46-2.37C16.84 3.2 14.64 2.3 12 2.3 8.41 2.3 5.37 4.37 3.96 7.36z"/>
              <path fill="#FBBC05" d="M12 20.7c2.64 0 4.84-.88 6.45-2.4l-2.98-2.45c-.8.55-1.87.94-3.47.94-3.28 0-4.88-2.24-5.1-3.4H1.82v2.14C3.21 18.43 7.33 20.7 12 20.7z"/>
              <path fill="#4285F4" d="M21.2 12.57c.09-.4.14-.82.14-1.37 0-.35-.04-.69-.1-1.02H12v3.6h5.1c-.23 1.16-1.82 3.4-5.1 3.4-2.34 0-4.31-1.58-5.02-3.68H1.82v2.14C3.21 18.43 7.33 20.7 12 20.7c4.76 0 8.33-3.01 9.2-8.13z"/>
            </svg>
          </span>
          <span className="pointer-events-none block text-center">Sign in with Google</span>
        </Button>

        <p className="text-center mt-6 text-sm text-gray-400">
          Don&apos;t have an account? {" "}
          <Link href="/sign-up" className="text-blue-400 hover:underline">Sign Up</Link>
        </p>
      </AuthCard>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex flex-col items-center pt-10">
        <div className="w-24 h-24 rounded-md overflow-hidden mb-0 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/signup_logo.png" alt="RemoteHub" className="w-full h-full object-cover bg-black" />
        </div>
        <AuthTabs />
        <AuthCard title="Welcome Back" subtitle="Sign in to your RemoteHub account">
          <div className="flex justify-center py-8">
            <Spinner size={24} />
          </div>
        </AuthCard>
      </main>
    }>
      <SignInForm />
    </Suspense>
  );
}
