import { NextRequest, NextResponse } from "next/server";

interface MeetingEndRequest {
  roomName: string;
  endedAt: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomName: string }> }
) {
  try {
    const { roomName } = await params;
    
    // Validate room name
    if (!roomName || typeof roomName !== "string") {
      return NextResponse.json(
        { error: "Invalid room name" },
        { status: 400 }
      );
    }

    // Sanitize room name to prevent injection attacks
    const sanitizedRoomName = roomName.replace(/[^a-zA-Z0-9-_]/g, "");
    
    if (sanitizedRoomName !== roomName) {
      return NextResponse.json(
        { error: "Room name contains invalid characters" },
        { status: 400 }
      );
    }

    const body: MeetingEndRequest = await request.json();
    
    // Validate request body
    if (!body.endedAt || typeof body.endedAt !== "string") {
      return NextResponse.json(
        { error: "Invalid endedAt timestamp" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Authenticate the user (check JWT token)
    // 2. Verify the user has permission to end this meeting
    // 3. Log the meeting end event
    // 4. Update meeting status in database
    // 5. Send notifications to participants
    // 6. Clean up meeting resources

    console.log(`Meeting ended: ${sanitizedRoomName} at ${body.endedAt}`);

    // Example of what you might do:
    // await meetingService.endMeeting(sanitizedRoomName, body.endedAt);
    // await notificationService.notifyMeetingEnded(sanitizedRoomName);
    // await cleanupService.cleanupMeetingResources(sanitizedRoomName);

    return NextResponse.json(
      { 
        success: true, 
        message: `Meeting ${sanitizedRoomName} ended successfully`,
        endedAt: body.endedAt 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error ending meeting:", error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "Failed to end meeting" 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
