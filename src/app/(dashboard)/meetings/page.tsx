"use client";
import React, { useState, useEffect } from "react";
import CreateMeetingModal from "@/components/meeting/CreateMeetingModal";
import MeetingCard from "@/components/meeting/MeetingCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { meetingService } from "@/services/meetingService";
import { MeetingResponse } from "@/types/meeting";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuthContext } from "@/context/AuthContext";


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
  const { success, error: toastError } = useToast();
  const { user } = useAuthContext();
  const [roomName, setRoomName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingMeetingId, setDeletingMeetingId] = useState<string | null>(null);

  // Load meetings on component mount
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await meetingService.getMeetings({
        page: 1,
        limit: 100,
        sortBy: "scheduledAt",
        sortOrder: "asc",
      });

      // Debug: Log the response to see what backend returns
      console.log("Meetings response from backend:", response);
      console.log("Meetings array:", response.meetings);

      // Convert API response to component Meeting format
      const meetingsList: Meeting[] = response.meetings
        .filter((m: MeetingResponse) => {
          // Filter out meetings without IDs first
          const meetingId = m.id || (m as { _id?: string })._id;
          if (!meetingId) {
            console.warn("Meeting missing ID:", m);
            return false;
          }
          return true;
        })
        .map((m: MeetingResponse) => {
          // Ensure meeting has an ID - check both id and _id fields (backend might use either)
          const meetingId = m.id || (m as { _id?: string })._id || "";

          return {
            id: meetingId,
            title: m.title,
            description: m.description || "",
            scheduledAt: m.scheduledAt,
            duration: m.duration,
            isPublic: m.isPublic,
            status: m.status,
            roomName: meetingId, // Use meeting ID as roomName
            participants: m.participants?.map(p => ({
              id: p.userId,
              name: p.user.name,
              email: p.user.email,
            })) || [],
            maxParticipants: m.maxParticipants || 50,
            createdAt: m.createdAt,
            createdBy: m.createdBy,
          };
        });

      setMeetings(meetingsList);
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
    success("Meeting created successfully");
    // Optionally join the meeting immediately
    // window.location.href = `/meeting/${encodeURIComponent(newMeeting.roomName)}`;
  };

  const handleCreateQuickMeeting = () => {
    const newRoomName = `meeting-${Date.now()}`;
    window.location.href = `/meeting/${encodeURIComponent(newRoomName)}`;
  };

  const handleDeleteMeeting = async (meeting: Meeting) => {
    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${meeting.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingMeetingId(meeting.id);
      
      await meetingService.deleteMeeting(meeting.id);
      
      // Remove meeting from list
      setMeetings(prev => prev.filter(m => m.id !== meeting.id));
      
      success("Meeting deleted successfully");
    } catch (error) {
      console.error("Error deleting meeting:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete meeting";
      toastError(errorMessage);
    } finally {
      setDeletingMeetingId(null);
    }
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
          <div className="flex flex-wrap items-center gap-2" />
          
          <Button onClick={() => setShowCreateModal(true)} variant="success" size="sm" className="shrink-0">
            Create Meeting
          </Button>
        </div>
      </div>

      {/* Meetings view */}
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
              {meetings.map((meeting) => {
                // Only show delete button to the meeting creator
                const canDelete = user?.id && meeting.createdBy === user.id;
                
                return (
                  <MeetingCard
                    key={meeting.id || `meeting-${meeting.createdAt}`}
                    meeting={meeting}
                    onJoin={handleJoinMeetingFromCard}
                    onDelete={canDelete ? handleDeleteMeeting : undefined}
                    isDeleting={deletingMeetingId === meeting.id}
                  />
                );
              })}
            </div>
          )}
        </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
}


