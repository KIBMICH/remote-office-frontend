"use client";
import React, { useState } from "react";

export type Tab = {
  key: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  value?: string;
  onChange?: (key: string) => void;
  className?: string;
  fullWidth?: boolean;
};

export default function Tabs({ tabs, value, onChange, className = "", fullWidth = false }: TabsProps) {
  const [internal, setInternal] = useState(tabs[0]?.key ?? "");
  const active = value ?? internal;

  const setActive = (k: string) => {
    if (!value) setInternal(k);
    onChange?.(k);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-900/80 border border-gray-800 rounded-lg p-1 ${fullWidth ? "grid grid-cols-2 sm:grid-cols-4 gap-1" : "inline-flex"}`}>
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`${fullWidth ? "w-full" : ""} px-4 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
