"use client";
import React, { useState } from "react";
import AuthTabs from "@/components/auth/AuthTabs";
import AuthCard from "@/components/auth/AuthCard";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/auth/OtpInput";

export default function TwoFASetupPage() {
  const [step, setStep] = useState<"intro" | "verify">("intro");
  const [code, setCode] = useState("");

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
        title={step === "intro" ? "2FA Setup" : "Verify Code"}
        subtitle={
          step === "intro"
            ? "Secure your account by enabling Two-Factor Authentication."
            : "Enter the 6-digit code from your authenticator app."
        }
      >
        {step === "intro" ? (
          <div className="space-y-6">
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Install Google Authenticator, 1Password, or Authy.</li>
              <li>Scan the QR code in your account security settings (placeholder).</li>
              <li>Enter the 6-digit code to verify.</li>
            </ol>
            <Button onClick={() => setStep("verify")}  
            variant="secondary"
            className="w-full h-10 rounded-md !bg-blue-600 hover:!bg-blue-700 !text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
              Continue
            </Button>
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              // handle verify
              alert(`Verifying code: ${code}`);
            }}
          >
            <OtpInput onChange={setCode} />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Verify & Enable 2FA
            </Button>
          </form>
        )}
      </AuthCard>
    </main>
  );
}
