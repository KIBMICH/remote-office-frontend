import React from "react";

type Option = Readonly<{ label: string; value: string }>;

type SelectProps = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: ReadonlyArray<Option>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function Select({ label, value, onChange, options, placeholder, className = "", disabled, readOnly }: SelectProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>}
      <div className={`relative`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || readOnly}
          className={`w-full appearance-none bg-gray-950/60 border border-gray-800 rounded-md px-3 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 disabled:opacity-70`}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option className="bg-black" key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
