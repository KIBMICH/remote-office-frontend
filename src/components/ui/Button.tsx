"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", children, ...rest }: ButtonProps) {
  const base = "px-4 py-2 rounded font-medium";
  const cls = variant === "primary" ? `${base} bg-blue-600 text-white` : `${base} bg-gray-200`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
