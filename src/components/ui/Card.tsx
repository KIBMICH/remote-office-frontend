import React from "react";

export type CardProps = {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export default function Card({ title, action, className = "", children }: CardProps) {
  return (
    <section className={`bg-gray-900/80 border border-gray-800 rounded-xl p-5 text-gray-100 ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between mb-4">
          {title ? <h3 className="font-semibold text-sm tracking-wide text-gray-200">{title}</h3> : <span />}
          {action ? <div className="text-xs text-gray-400">{action}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
