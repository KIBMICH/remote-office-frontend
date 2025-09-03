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
  const base = "px-4 py-2 rounded font-medium transition-colors duration-200";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border-2 border-current text-current hover:bg-current hover:text-white"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
