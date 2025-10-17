"use client";
import React from "react";
import Button from "@/components/ui/Button";

type ControlBarProps = {
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
  onShareScreen?: () => void;
  onRaiseHand?: () => void;
  onMore?: () => void;
  onLeave?: () => void;
};

export default function ControlBar({
  onToggleMic,
  onToggleCamera,
  onShareScreen,
  onRaiseHand,
  onMore,
  onLeave,
}: ControlBarProps) {
  const iconBtn = "bg-gray-900/70 border border-gray-800 hover:bg-gray-800/80 text-gray-200";

  return (
    <div className="rounded-xl border border-gray-800 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <Button className={iconBtn} size="sm" variant="outline" onClick={onToggleMic} aria-label="Toggle microphone">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 15a4 4 0 0 0 4-4V7a4 4 0 1 0-8 0v4a4 4 0 0 0 4 4Z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 19v3"/></svg>
        </Button>
        <Button className={iconBtn} size="sm" variant="outline" onClick={onToggleCamera} aria-label="Toggle camera">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M22 7l-4 3v4l4 3V7Z"/></svg>
        </Button>
        <Button className={iconBtn} size="sm" variant="outline" onClick={onShareScreen} aria-label="Share screen">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>
        </Button>
        <Button className={iconBtn} size="sm" variant="outline" onClick={onRaiseHand} aria-label="Raise hand">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 13V7a2 2 0 1 1 4 0v4"/><path d="M12 10V6a2 2 0 1 1 4 0v5"/><path d="M16 11V7a2 2 0 1 1 4 0v6a6 6 0 0 1-6 6H9a5 5 0 0 1-5-5v-3a2 2 0 1 1 4 0v1"/></svg>
        </Button>
        <Button className={iconBtn} size="sm" variant="outline" onClick={onMore} aria-label="More actions">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>
        </Button>
        <div className="ml-auto" />
        <Button className="bg-rose-600 hover:bg-rose-700" size="sm" onClick={onLeave}>
          Leave
        </Button>
      </div>
    </div>
  );
}


