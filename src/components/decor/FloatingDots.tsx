import React from "react";

// Animation constants for readability and easy tuning
const SPEED_MULT = 0.1; // 20% of base duration (fast, continuous)
const GLOW_DUR = 3.6; // seconds
const PULSE_DUR = 4.8; // seconds

// Drift normalization base/multipliers (organized elliptical flow)
const DX_BASE = 12;
const DY_BASE = 9;
const DX_MULT = 4;
const DY_MULT = 3;

export type DotSpec = {
  left: number; // percentage 0-100
  top: number; // percentage 0-100
  size: number; // px
  opacity: number; // 0-1
  duration: number; // seconds
  delay: number; // seconds
  driftX: number; // px (base, but we normalize below)
  driftY: number; // px (base, but we normalize below)
};

// Fixed set to keep SSR/CSR consistent and lightweight
export const DOTS: DotSpec[] = [
  { left: 8, top: 14, size: 2, opacity: 0.22, duration: 18, delay: 0, driftX: 8, driftY: 10 },
  { left: 18, top: 26, size: 3, opacity: 0.18, duration: 22, delay: 3, driftX: 10, driftY: 12 },
  { left: 28, top: 10, size: 2, opacity: 0.25, duration: 16, delay: 1, driftX: 7, driftY: 8 },
  { left: 38, top: 30, size: 4, opacity: 0.15, duration: 24, delay: 5, driftX: 12, driftY: 14 },
  { left: 50, top: 12, size: 2, opacity: 0.2, duration: 19, delay: 2, driftX: 8, driftY: 9 },
  { left: 60, top: 28, size: 3, opacity: 0.17, duration: 21, delay: 4, driftX: 10, driftY: 11 },
  { left: 72, top: 16, size: 2, opacity: 0.23, duration: 20, delay: 1.5, driftX: 9, driftY: 10 },
  { left: 82, top: 22, size: 3, opacity: 0.16, duration: 26, delay: 6, driftX: 11, driftY: 13 },
  { left: 12, top: 48, size: 3, opacity: 0.2, duration: 23, delay: 2.5, driftX: 9, driftY: 12 },
  { left: 24, top: 56, size: 2, opacity: 0.22, duration: 18, delay: 0.8, driftX: 8, driftY: 9 },
  { left: 36, top: 44, size: 3, opacity: 0.18, duration: 22, delay: 3.2, driftX: 10, driftY: 11 },
  { left: 48, top: 58, size: 4, opacity: 0.14, duration: 28, delay: 7, driftX: 12, driftY: 15 },
  { left: 62, top: 46, size: 2, opacity: 0.24, duration: 17, delay: 1.1, driftX: 7, driftY: 8 },
  { left: 74, top: 60, size: 3, opacity: 0.18, duration: 21, delay: 3.6, driftX: 10, driftY: 12 },
  { left: 86, top: 50, size: 2, opacity: 0.22, duration: 19, delay: 2.2, driftX: 9, driftY: 9 },
  { left: 10, top: 78, size: 2, opacity: 0.2, duration: 20, delay: 1.4, driftX: 8, driftY: 10 },
  { left: 22, top: 84, size: 3, opacity: 0.16, duration: 26, delay: 5.5, driftX: 11, driftY: 13 },
  { left: 34, top: 72, size: 2, opacity: 0.24, duration: 18, delay: 0.5, driftX: 7, driftY: 8 },
  { left: 46, top: 86, size: 3, opacity: 0.18, duration: 22, delay: 3.8, driftX: 10, driftY: 12 },
  { left: 58, top: 74, size: 4, opacity: 0.14, duration: 28, delay: 6.8, driftX: 13, driftY: 15 },
  { left: 70, top: 88, size: 2, opacity: 0.22, duration: 19, delay: 1.9, driftX: 8, driftY: 9 },
  { left: 80, top: 76, size: 3, opacity: 0.18, duration: 23, delay: 4.4, driftX: 10, driftY: 12 },
  { left: 90, top: 84, size: 2, opacity: 0.2, duration: 20, delay: 2.7, driftX: 9, driftY: 10 },
  // Additional dots for higher density (kept small and subtle)
  { left: 5, top: 8, size: 2, opacity: 0.22, duration: 20, delay: 0.6, driftX: 7, driftY: 8 },
  { left: 15, top: 18, size: 2, opacity: 0.2, duration: 22, delay: 1.2, driftX: 8, driftY: 9 },
  { left: 27, top: 22, size: 3, opacity: 0.18, duration: 24, delay: 2.4, driftX: 10, driftY: 11 },
  { left: 33, top: 12, size: 2, opacity: 0.23, duration: 18, delay: 0.9, driftX: 7, driftY: 8 },
  { left: 44, top: 18, size: 2, opacity: 0.21, duration: 19, delay: 1.7, driftX: 8, driftY: 9 },
  { left: 56, top: 14, size: 3, opacity: 0.17, duration: 23, delay: 2.8, driftX: 10, driftY: 12 },
  { left: 66, top: 20, size: 2, opacity: 0.22, duration: 21, delay: 1.3, driftX: 9, driftY: 10 },
  { left: 78, top: 14, size: 2, opacity: 0.2, duration: 20, delay: 0.7, driftX: 8, driftY: 9 },
  { left: 90, top: 18, size: 3, opacity: 0.18, duration: 25, delay: 3.1, driftX: 10, driftY: 11 },
  { left: 6, top: 38, size: 2, opacity: 0.23, duration: 18, delay: 0.4, driftX: 7, driftY: 8 },
  { left: 18, top: 40, size: 2, opacity: 0.21, duration: 19, delay: 1.6, driftX: 8, driftY: 9 },
  { left: 30, top: 52, size: 3, opacity: 0.18, duration: 22, delay: 2.1, driftX: 10, driftY: 11 },
  { left: 42, top: 40, size: 2, opacity: 0.24, duration: 17, delay: 0.3, driftX: 7, driftY: 8 },
  { left: 54, top: 52, size: 2, opacity: 0.22, duration: 18, delay: 1.1, driftX: 8, driftY: 9 },
  { left: 66, top: 42, size: 3, opacity: 0.18, duration: 23, delay: 3.3, driftX: 10, driftY: 12 },
  { left: 78, top: 54, size: 2, opacity: 0.2, duration: 20, delay: 0.9, driftX: 8, driftY: 9 },
  { left: 90, top: 46, size: 2, opacity: 0.22, duration: 19, delay: 2.5, driftX: 9, driftY: 10 },
  { left: 6, top: 70, size: 2, opacity: 0.22, duration: 20, delay: 0.8, driftX: 7, driftY: 8 },
  { left: 18, top: 68, size: 3, opacity: 0.18, duration: 24, delay: 2.2, driftX: 10, driftY: 12 },
  { left: 30, top: 80, size: 2, opacity: 0.21, duration: 19, delay: 1.0, driftX: 8, driftY: 9 },
  { left: 42, top: 72, size: 2, opacity: 0.24, duration: 17, delay: 0.5, driftX: 7, driftY: 8 },
  { left: 54, top: 84, size: 3, opacity: 0.18, duration: 23, delay: 3.0, driftX: 10, driftY: 11 },
  { left: 66, top: 78, size: 2, opacity: 0.22, duration: 21, delay: 1.6, driftX: 9, driftY: 10 },
  { left: 78, top: 86, size: 2, opacity: 0.2, duration: 20, delay: 0.6, driftX: 8, driftY: 9 },
  { left: 90, top: 72, size: 3, opacity: 0.18, duration: 25, delay: 2.9, driftX: 10, driftY: 12 },
];

// Typed style that supports CSS custom properties without ts-ignore
export type DotVars = React.CSSProperties & {
  "--dx"?: string | number;
  "--dy"?: string | number;
  "--s"?: string | number;
};

export default function FloatingDots() {
  return (
    <div className="fdots pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {DOTS.map((d, i) => {
        const style: DotVars = {
          left: `${d.left}%`,
          top: `${d.top}%`,
          width: d.size,
          height: d.size,
          backgroundColor: "rgba(255,255,255,0.9)",
          opacity: Math.min(d.opacity + 0.08, 0.32),
          boxShadow: "0 0 10px rgba(255,255,255,0.18)",
          transform: "translate3d(0,0,0) scale(var(--s,1))",
          willChange: "transform",
          animation: [
            `dot-float ${d.duration * SPEED_MULT}s linear ${d.delay}s infinite`,
            `dot-glow ${GLOW_DUR}s ease-in-out ${d.delay / 2}s infinite alternate`,
            `dot-pulse ${PULSE_DUR}s ease-in-out ${d.delay / 3}s infinite alternate`,
          ].join(", "),
          "--dx": Math.round(DX_BASE + d.size * DX_MULT) + "px",
          "--dy": Math.round(DY_BASE + d.size * DY_MULT) + "px",
          "--s": 1,
        };

        return (
          <span
            key={i}
            role="presentation"
            className="absolute block rounded-full"
            style={style}
          />
        );
      })}
    </div>
  );
}
