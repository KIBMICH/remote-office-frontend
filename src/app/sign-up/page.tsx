"use client";
import React, { useState } from "react";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center pt-10">
      <div className="w-24 h-24 rounded-md overflow-hidden mb-4 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/globe.svg" alt="RemoteHub" className="w-full h-full object-cover bg-black" />
      </div>
      <AuthTabs />
      <AuthCard title="Create Account" subtitle="Join RemoteHub in a few clicks">
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
              <Input type="text" placeholder="Jane Doe" className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
              <Input type="email" placeholder="name@company.com" className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500" />
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
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Create Account</Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account? {" "}
          <Link href="/sign-in" className="text-blue-400 hover:underline">Sign In</Link>
        </p>
      </AuthCard>
    </main>
  );
}
