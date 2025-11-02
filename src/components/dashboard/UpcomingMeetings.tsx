"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { meetingService } from "@/services/meetingService";
import { MeetingResponse } from "@/types/meeting";

interface MeetingItem {
  id: string;
  title: string;
  scheduledAt: string;
  roomName?: string;
}

const formatMeetingTime = (scheduledAt: string): string => {
  try {
    const date = new Date(scheduledAt);
    const now = new Date();
    
    // Check if meeting is today
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      // Return time only if today
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Return date and time for future dates
      const day = date.toLocaleDateString([], { weekday: 'short' });
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${day}, ${time}`;
    }
  } catch (error) {
    console.error("Error formatting meeting time:", error);
    return scheduledAt;
  }
};

export default function UpcomingMeetings() {
  const router = useRouter();
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingMeetings();
  }, []);

  const fetchUpcomingMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await meetingService.getMeetings({
        status: "scheduled",
        page: 1,
        limit: 10, // Fetch more to ensure we have enough after filtering
        sortBy: "scheduledAt",
        sortOrder: "asc",
      });

      // Debug: Log response to see structure
      console.log("UpcomingMeetings: Full response:", response);
      console.log("UpcomingMeetings: Response type:", typeof response);
      console.log("UpcomingMeetings: Is array?", Array.isArray(response));
      console.log("UpcomingMeetings: Meetings property:", response.meetings);
      console.log("UpcomingMeetings: Meetings array length:", response.meetings?.length);

      // Handle different response structures:
      // 1. Direct array: response is MeetingResponse[]
      // 2. Paginated: response.meetings is MeetingResponse[]
      // 3. Nested: response.data.meetings is MeetingResponse[]
      let meetingsArray: MeetingResponse[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly an array
        meetingsArray = response;
      } else if (response.meetings && Array.isArray(response.meetings)) {
        // Standard paginated response
        meetingsArray = response.meetings;
      } else {
        // Try nested response structure
        const nestedResponse = response as unknown as { data?: { meetings?: MeetingResponse[] } };
        if (nestedResponse.data?.meetings && Array.isArray(nestedResponse.data.meetings)) {
          meetingsArray = nestedResponse.data.meetings;
        }
      }
      
      console.log("UpcomingMeetings: Final meetings array:", meetingsArray);
      console.log("UpcomingMeetings: Meetings count:", meetingsArray.length);

      // Filter meetings that are in the future and map to display format
      const now = new Date();
      const upcomingMeetings: MeetingItem[] = meetingsArray
        .filter((meeting: MeetingResponse) => {
          // Handle both id and _id formats (MongoDB compatibility)
          const meetingId = meeting.id || (meeting as { _id?: string })._id || "";
          
          // Parse scheduled date
          const scheduledDate = new Date(meeting.scheduledAt);
          
          // Keep only meetings with valid ID and future dates
          return meetingId && scheduledDate >= now;
        })
        .slice(0, 3) // Take only first 3
        .map((meeting: MeetingResponse) => {
          const meetingId = meeting.id || (meeting as { _id?: string })._id || "";
          return {
            id: meetingId,
            title: meeting.title,
            scheduledAt: meeting.scheduledAt,
            roomName: (meeting as { roomName?: string }).roomName || meetingId,
          };
        });

      console.log("UpcomingMeetings: Filtered meetings:", upcomingMeetings);
      setMeetings(upcomingMeetings);
    } catch (err) {
      console.error("UpcomingMeetings: Failed to fetch meetings:", err);
      setError("Failed to load upcoming meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meeting: MeetingItem) => {
    const roomName = meeting.roomName || meeting.id;
    router.push(`/meeting/${roomName}`);
  };

  return (
    <Card title="Upcoming Meetings" action={<a href="/meetings" className="text-blue-400 hover:text-blue-300">View All →</a>}>
      {loading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-400 text-sm">Loading meetings...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm">No upcoming meetings</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-lg px-4 py-3">
              <div>
                <div className="text-sm text-gray-100 font-medium">{meeting.title}</div>
                <div className="text-xs text-gray-400">{formatMeetingTime(meeting.scheduledAt)}</div>
              </div>
              <Button 
                size="sm" 
                className="bg-gray-700 hover:bg-gray-600"
                onClick={() => handleJoinMeeting(meeting)}
              >
                Join
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
