"use client";
import React, { useState } from "react";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthCard from "@/components/auth/AuthCard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center pt-10">
      {/* Top centered image/logo */}
      <div className="w-32 h-32 rounded-md overflow-hidden mb-0 shadow-lg">
        {/* Replace src with your desired image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/remote_logo.png" alt="Remortify" className="w-full h-full object-contain bg-black" />
      </div>
      <AuthTabs />
      <AuthCard
        title={sent ? "Check your email" : "Reset Password"}
        subtitle={
          sent
            ? "We've sent a password reset link to your inbox."
            : "Enter your account email to receive a password reset link."
        }
      >
        {!sent ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <Input type="email" placeholder="name@company.com" label="Email" />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Send reset link
            </Button>
          </form>
        ) : (
          <div className="text-center text-gray-300">
            If you don&apos;t see the email, check your spam folder.
          </div>
        )}
      </AuthCard>
    </main>
  );
}
