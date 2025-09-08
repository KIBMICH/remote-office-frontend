"use client";
import React from "react";

type SpinnerProps = {
  size?: number; // in px
  className?: string;
};

export default function Spinner({ size = 18, className = "" }: SpinnerProps) {
  const stroke = 2;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-label="Loading"
      role="status"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth={stroke}
        fill="none"
      />
      <path
        d={describeArc(size / 2, size / 2, radius, 0, 270)}
        stroke="currentColor"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Utility to draw arc for the foreground stroke
function polarToCartesian(cx: number, cy: number, r: number, angleInDeg: number) {
  const angleInRad = ((angleInDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRad),
    y: cy + r * Math.sin(angleInRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M",
    start.x,
    start.y,
    "A",
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
  return d;
}
