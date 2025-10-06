"use client";

import React from "react";
import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

type Props = {
  onMenuClick?: () => void;
};

export default function DashboardHeader({ onMenuClick }: Props) {
  const { user } = useAuthContext();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900"
            aria-label="Open menu"
            onClick={onMenuClick}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded overflow-hidden">
              <img src="/remote_logo.png" alt="Remortify" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-white text-lg -ml-1">Remortify</span>
          </div>
        </div>

        {/* Right: Search + icons */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search everything..."
              className="bg-gray-900 text-gray-100 placeholder-gray-400 rounded-l-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-800"
            />
            <button className="bg-purple-600 w-10 h-10 rounded-r-lg flex items-center justify-center hover:bg-purple-700 transition-colors border border-purple-600">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <div className="text-gray-300 text-sm">3</div>
          <Link href="/settings" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span>{user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
