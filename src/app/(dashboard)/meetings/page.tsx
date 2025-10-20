"use client";
import React, { useState, useEffect } from "react";
import VideoGrid from "@/components/meeting/VideoGrid";
import ChatPanel from "@/components/meeting/ChatPanel";
import ControlBar from "@/components/meeting/ControlBar";
import CreateMeetingModal from "@/components/meeting/CreateMeetingModal";
import MeetingCard from "@/components/meeting/MeetingCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

interface Meeting {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  isPublic: boolean;
  status: string;
  roomName: string;
  participants: Array<{ id: string; name: string; email: string }>;
  maxParticipants: number;
  createdAt: string;
  createdBy: string;
}

export default function MeetingPage() {
  const [viewMode, setViewMode] = useState<"meetings" | "demo">("meetings");
  const [roomName, setRoomName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load meetings on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/meetings/list");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch meetings");
      }

      setMeetings(result.meetings || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setError(error instanceof Error ? error.message : "Failed to load meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = () => {
    if (!roomName.trim()) return;
    window.location.href = `/meeting/${encodeURIComponent(roomName.trim())}`;
  };

  const handleJoinMeetingFromCard = (meeting: Meeting) => {
    window.location.href = `/meeting/${encodeURIComponent(meeting.roomName)}`;
  };

  const handleMeetingCreated = (newMeeting: Meeting) => {
    setMeetings(prev => [newMeeting, ...prev]);
    // Optionally join the meeting immediately
    // window.location.href = `/meeting/${encodeURIComponent(newMeeting.roomName)}`;
  };

  const handleCreateQuickMeeting = () => {
    const newRoomName = `meeting-${Date.now()}`;
    window.location.href = `/meeting/${encodeURIComponent(newRoomName)}`;
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4 p-4 sm:p-6">
      {/* Header with meeting controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetings</h1>
          <p className="text-gray-400">Join or create video meetings</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-2 flex-wrap w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setViewMode("meetings")}
              variant={viewMode === "meetings" ? "primary" : "outline"}
              size="sm"
            >
              My Meetings
            </Button>
            <Button
              onClick={() => setViewMode("demo")}
              variant={viewMode === "demo" ? "primary" : "outline"}
              size="sm"
            >
              Demo View
            </Button>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)} variant="success" size="sm" className="shrink-0">
            Create Meeting
          </Button>
        </div>
      </div>

      {/* Meetings view */}
      {viewMode === "meetings" && (
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading meetings...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-400 text-2xl mb-4">⚠️</div>
                <p className="text-gray-400 mb-4">{error}</p>
                <Button onClick={fetchMeetings} variant="outline">
                  Retry
                </Button>
              </div>
            </div>
          ) : meetings.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Meetings Yet</h3>
                <p className="text-gray-400 mb-6">
                  Create your first meeting to get started
                </p>
                <Button onClick={() => setShowCreateModal(true)} variant="success">
                  Create Meeting
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onJoin={handleJoinMeetingFromCard}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Demo view */}
      {viewMode === "demo" && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 sm:gap-6">
          <div className="min-w-0 order-1">
            <VideoGrid participants={demoParticipants} />
          </div>
          <div className="min-w-0 order-2 hidden lg:block">
            <ChatPanel initialMessages={demoMessages} />
          </div>
        </div>
      )}

      {/* Demo control bar */}
      {viewMode === "demo" && (
        <div className="mx-auto w-full max-w-4xl px-0 sm:px-2">
          <ControlBar />
        </div>
      )}

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}


