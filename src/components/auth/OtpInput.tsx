"use client";
import React, { useEffect, useRef, useState } from "react";

export default function OtpInput({ length = 6, onChange }: { length?: number; onChange?: (code: string) => void; }) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    onChange?.(values.join(""));
  }, [values, onChange]);

  const handleChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...values];
    next[idx] = val;
    setValues(next);
    if (val && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={values[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-xl bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
