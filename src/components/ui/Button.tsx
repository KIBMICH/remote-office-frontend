"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
};

export default function Button({ 
  variant = "primary", 
  size = "md", 
  children, 
  className = "",
  ...rest 
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded font-medium transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed touch-manipulation select-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
    outline: "border-2 border-current text-current hover:bg-current hover:text-white active:opacity-80"
  };
  
  const sizes = {
    sm: "px-2 sm:px-3 py-2 sm:py-1.5 text-sm min-h-[40px] sm:min-h-[32px]",
    md: "px-3 sm:px-4 py-2 text-base min-h-[44px] sm:min-h-[40px]",
    lg: "px-4 sm:px-6 py-3 text-lg min-h-[48px] sm:min-h-[44px]"
  };
  
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
