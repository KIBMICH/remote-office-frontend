"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const tabs = [
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
  { href: "/reset-password", label: "Reset Password" },
  { href: "/2fa-setup", label: "2FA Setup" },
];

export default function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="mx-auto mt-6 w-full max-w-[540px]">
      <div className="flex rounded-full bg-gray-900 p-1 border border-gray-800 overflow-hidden w-full">
        {tabs.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex-1 text-center h-9 leading-9 text-sm md:text-[15px] rounded-md transition-colors font-semibold
                ${active ? "bg-blue-600 text-white shadow-sm" : "text-gray-200 hover:text-white"}
              `}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
