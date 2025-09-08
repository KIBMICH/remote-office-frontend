import React from "react";

type ProgressProps = {
  value: number; // 0 - 100
  className?: string;
  colorClass?: string; // tailwind bg class for the bar
};

export default function Progress({ value, className = "", colorClass = "bg-blue-600" }: ProgressProps) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full h-2 bg-gray-800 rounded ${className}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe} role="progressbar">
      <div className={`h-2 ${colorClass} rounded`} style={{ width: `${safe}%` }} />
    </div>
  );
}
