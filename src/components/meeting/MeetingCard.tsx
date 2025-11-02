"use client";

import React from "react";
import Button from "@/components/ui/Button";

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

interface MeetingCardProps {
  meeting: Meeting;
  onJoin: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
  onDelete?: (meeting: Meeting) => void;
  isDeleting?: boolean;
}

export default function MeetingCard({ 
  meeting, 
  onJoin, 
  onEdit, 
  onDelete,
  isDeleting = false
}: MeetingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "Past";
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-600";
      case "live": return "bg-green-600";
      case "ended": return "bg-gray-600";
      case "cancelled": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled": return "Scheduled";
      case "live": return "Live Now";
      case "ended": return "Ended";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/80 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getStatusColor(meeting.status)}`}>
              {getStatusText(meeting.status)}
            </span>
            {meeting.isPublic && (
              <span className="px-2 py-1 text-xs font-medium text-purple-300 bg-purple-900/50 rounded-full">
                Public
              </span>
            )}
          </div>
          {meeting.description && (
            <p className="text-gray-400 text-sm mb-3">{meeting.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Scheduled:</span>
          <div className="text-white font-medium">
            {formatDate(meeting.scheduledAt)}
          </div>
          <div className="text-gray-400">
            {formatTime(meeting.scheduledAt)}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Duration:</span>
          <div className="text-white font-medium">
            {meeting.duration} minutes
          </div>
        </div>
        <div>
          <span className="text-gray-500">Participants:</span>
          <div className="text-white font-medium">
            {meeting.participants.length}/{meeting.maxParticipants}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Room ID:</span>
          <div className="text-white font-mono text-xs">
            {meeting.roomName}
          </div>
        </div>
      </div>

      {meeting.participants.length > 0 && (
        <div className="mb-4">
          <span className="text-gray-500 text-sm">Attendees:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {meeting.participants.slice(0, 3).map((participant) => (
              <div 
                key={participant.id}
                className="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded-full"
              >
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {participant.name.charAt(0)}
                  </span>
                </div>
                <span className="text-gray-300 text-xs">{participant.name}</span>
              </div>
            ))}
            {meeting.participants.length > 3 && (
              <div className="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded-full">
                <span className="text-gray-300 text-xs">
                  +{meeting.participants.length - 3} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={() => onJoin(meeting)}
          variant="primary"
          className="flex-1"
        >
          {meeting.status === "live" ? "Join Meeting" : "Join Now"}
        </Button>
        
        {onEdit && (
          <Button
            onClick={() => onEdit(meeting)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
        )}
        
        {onDelete && (
          <Button
            onClick={() => onDelete(meeting)}
            variant="outline"
            size="sm"
            className="text-red-400 border-red-400/50 hover:bg-red-400/10"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
}
