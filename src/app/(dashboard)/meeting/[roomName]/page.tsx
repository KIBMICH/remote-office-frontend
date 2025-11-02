"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AgoraMeet from "@/components/meeting/AgoraMeet";
import { useAuthContext } from "@/context/AuthContext";
import { getMeetingById, getMeetings } from "@/services/meetingService";
import { MeetingResponse } from "@/types/meeting";

export default function DynamicMeetingPage() {
  const params = useParams();
  const { user } = useAuthContext();
  const roomName = params.roomName as string;
  const [meeting, setMeeting] = useState<MeetingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      if (!roomName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Use the same method as meetings page - get all meetings and filter
        const response = await getMeetings({
          page: 1,
          limit: 100,
        });
        
        const foundMeeting = response.meetings.find(
          (m: MeetingResponse) => {
            const meetingId = m.id || (m as { _id?: string })._id;
            return meetingId === roomName;
          }
        );

        if (foundMeeting) {
          // Use the same pattern as meetings page - access title directly from response
          setMeeting(foundMeeting);
        } else {
          console.warn("Meeting not found in list. RoomName:", roomName);
        }
      } catch (err) {
        console.error("Failed to fetch meeting:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [roomName]);

  const handleMeetingEnd = (endedRoomName: string) => {
    console.log("Meeting ended:", endedRoomName);
   
    window.location.href = "/meetings";
  };

  const handleError = (error: Error) => {
    console.error("Meeting error:", error);
   
  };

  
  const safeRoomName = roomName || `meeting-${Date.now()}`;
 
  const userName = user?.name || user?.email || `Guest-${roomName?.slice(-8) || 'user'}`;


  const displayTitle = loading 
    ? "Loading meeting..." 
    : meeting?.title || "Meeting Room";

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">{displayTitle}</h1>
        </div>
        
        <AgoraMeet
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
