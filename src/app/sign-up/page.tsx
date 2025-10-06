"use client";

import React, { useState } from "react";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import Spinner from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";

export default function SignUpPage() {
  const router = useRouter();
  const { success: toastSuccess } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google sign-up via OAuth (full-page redirect)
  const handleGoogleSignUp = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const callback = `${window.location.origin}/auth/callback`;
      const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?redirectUri=${encodeURIComponent(callback)}`;
      window.location.href = backendUrl;
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError("Failed to initiate Google sign-up. Please try again.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register({ name, email, password });
      toastSuccess("Account created! Redirecting to Sign In...");
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/sign-in");
    } catch (err: unknown) {
      let message = "Registration failed";
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
      <div className="w-32 h-32 rounded-md overflow-hidden mb-0 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/remote_logo.png" alt="Remortify" className="w-full h-full object-contain bg-black" />
      </div>
      <AuthTabs />
      <AuthCard title="Create Account" subtitle="Join Remortify in a few clicks">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              <Input
                type="text"
                placeholder="Jane Doe"
                className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
              <Input
                type="email"
                placeholder="name@company.com"
                className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="•••••••"
                className="pl-10 pr-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
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
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={16} />
                <span>Creating Account...</span>
              </span>
            ) : (
              "Create Account"
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
          onClick={handleGoogleSignUp}
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
          <span className="pointer-events-none block text-center">Sign up with Google</span>
        </Button>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account? {" "}
          <Link href="/sign-in" className="text-blue-400 hover:underline">Sign In</Link>
        </p>
      </AuthCard>
    </main>
  );
}
