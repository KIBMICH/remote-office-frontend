"use client";
import React from "react";
import VideoGrid from "@/components/meeting/VideoGrid";
import ChatPanel from "@/components/meeting/ChatPanel";
import ControlBar from "@/components/meeting/ControlBar";

const demoParticipants = [
  { id: "1", name: "Alice Smith" },
  { id: "2", name: "Bob Johnson", isMuted: true },
  { id: "3", name: "You (Screen Share)", isScreenShare: true },
  { id: "4", name: "Charlie Brown" },
  { id: "5", name: "Diana Ross" },
  { id: "6", name: "Ethan Hunt" },
  { id: "7", name: "Fiona Gale" },
];

const demoMessages = [
  { id: "m1", author: "Alice Smith", time: "10:05 AM", text: "Good morning, everyone! Let's get started." },
  { id: "m2", author: "Bob Johnson", time: "10:06 AM", text: "Morning! Ready to discuss the Q3 report." },
  { id: "m3", author: "You", time: "10:07 AM", text: "Great, I'll share my screen in a moment." },
  { id: "m4", author: "Charlie Brown", time: "10:08 AM", text: "Excited to see the progress!" },
];

export default function MeetingPage() {
  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 p-4 sm:p-6">
      <div className="grid flex-1 gap-4 sm:gap-6" style={{ gridTemplateColumns: "1fr 360px" }}>
        <div className="min-w-0">
          <VideoGrid participants={demoParticipants} />
        </div>
        <div className="hidden lg:block min-w-0">
          <ChatPanel initialMessages={demoMessages} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <ControlBar />
      </div>
    </div>
  );
}


