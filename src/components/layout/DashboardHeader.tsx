"use client";

import React from "react";

export default function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="h-16 flex items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-xs font-bold">RH</div>
          <span className="font-semibold text-white">RemoteHub</span>
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
          <div className="w-8 h-8 bg-gray-700 rounded-full" />
        </div>
      </div>
    </header>
  );
}
