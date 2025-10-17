"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";

type ParticipantTileProps = {
  name: string;
  avatarUrl?: string;
  isMuted?: boolean;
  isScreenShare?: boolean;
};

export default function ParticipantTile({
  name,
  avatarUrl,
  isMuted = false,
  isScreenShare = false,
}: ParticipantTileProps) {
  const [showImage, setShowImage] = useState(Boolean(avatarUrl));
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? "";
    const second = parts[1]?.charAt(0) ?? "";
    return (first + second).toUpperCase();
  }, [name]);

  const bgClass = useMemo(() => {
    // Deterministic color based on name, Teams-like soft colors
    const palette = [
      "from-violet-600 to-indigo-600",
      "from-fuchsia-600 to-pink-600",
      "from-sky-600 to-blue-600",
      "from-emerald-600 to-teal-600",
      "from-amber-600 to-orange-600",
      "from-rose-600 to-red-600",
      "from-cyan-600 to-teal-600",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
  }, [name]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900/60 border border-gray-800 shadow-sm">
      {/* Video surface placeholder */}
      <div className="aspect-video w-full bg-black/50 relative">
        {showImage && avatarUrl ? (
          <Image
            src={avatarUrl as string}
            alt={name}
            width={640}
            height={360}
            className="h-full w-full object-cover"
            onError={() => setShowImage(false)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div
              className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br ${bgClass} shadow-lg ring-2 ring-white/10 grid place-items-center`}
              aria-hidden
            >
              <span className="text-white text-xl sm:text-2xl font-semibold tracking-wide">
                {initials}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer with name and status */}
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium text-white truncate">
            {name}
            {isScreenShare && (
              <span className="ml-2 text-[10px] sm:text-xs text-purple-300">(Screen Share)</span>
            )}
          </span>
          {isMuted && (
            <span className="ml-auto inline-flex items-center rounded bg-gray-800/80 px-1.5 py-0.5 text-[10px] text-gray-300">
              Muted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


