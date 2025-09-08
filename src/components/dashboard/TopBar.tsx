import React from "react";

export default function TopBar() {
  return (
    <div className="flex items-center justify-end pb-2">
      <div className="hidden md:flex items-center gap-3">
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
  );
}
