"use client";

import React from "react";
import { useParams } from "next/navigation";
import JitsiMeet from "@/components/meeting/JitsiMeet";
import { useAuthContext } from "@/context/AuthContext";

export default function DynamicMeetingPage() {
  const params = useParams();
  const { user } = useAuthContext();
  const roomName = params.roomName as string;

  const handleMeetingEnd = (endedRoomName: string) => {
    console.log("Meeting ended:", endedRoomName);
    // Redirect back to meetings list or dashboard
    window.location.href = "/meetings";
  };

  const handleError = (error: Error) => {
    console.error("Meeting error:", error);
    // You could show a toast notification here
  };

  // Generate a safe room name if none provided
  const safeRoomName = roomName || `meeting-${Date.now()}`;
  const userName = user?.name || user?.email || "Anonymous User";

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">Meeting Room</h1>
          <p className="text-gray-400">
            Room: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{safeRoomName}</span>
          </p>
        </div>
        
        <JitsiMeet
          roomName={safeRoomName}
          userName={userName}
          onMeetingEnd={handleMeetingEnd}
          onError={handleError}
          className="w-full"
        />
      </div>
    </div>
  );
}
