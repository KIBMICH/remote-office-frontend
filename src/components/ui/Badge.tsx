import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  color?: "green" | "yellow" | "gray";
  className?: string;
};

export default function Badge({ children, color = "gray", className = "" }: BadgeProps) {
  const colors = {
    green: "bg-emerald-600/20 text-emerald-400 border-emerald-600/40",
    yellow: "bg-yellow-600/20 text-yellow-300 border-yellow-600/40",
    gray: "bg-gray-600/20 text-gray-300 border-gray-600/40",
  } as const;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
}
