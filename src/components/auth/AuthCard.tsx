import React from "react";

export default function AuthCard({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string; }) {
  return (
    <div className="w-full mx-auto mt-6 md:mt-8 max-w-[540px]">
      <div className="bg-gray-800/80 border border-gray-700 rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-1">{title}</h2>
        {subtitle && (
          <p className="text-center text-gray-400 mb-6">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
