import { NextRequest, NextResponse } from "next/server";

interface CreateMeetingRequest {
  title: string;
  description?: string;
  scheduledAt?: string;
  duration?: number; // in minutes
  isPublic?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateMeetingRequest = await request.json();
    
    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: "Meeting title is required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const title = body.title.trim().substring(0, 100); // Limit length
    const description = body.description?.trim().substring(0, 500) || "";
    const isPublic = Boolean(body.isPublic);
    const duration = Math.min(Math.max(body.duration || 60, 15), 480); // 15 min to 8 hours
    
    // Generate a unique meeting ID
    const meetingId = `meeting-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Create meeting object
    const meeting = {
      id: meetingId,
      title,
      description,
      scheduledAt: body.scheduledAt || new Date().toISOString(),
      duration,
      isPublic,
      createdAt: new Date().toISOString(),
      createdBy: "user-id", // TODO: Get from auth context
      status: "scheduled",
      roomName: meetingId,
      participants: [],
      maxParticipants: 50,
    };

    // Here you would typically:
    // 1. Authenticate the user
    // 2. Save meeting to database
    // 3. Send notifications
    // 4. Create calendar event
    
    console.log("Created meeting:", meeting);

    // Example of what you might do:
    // await meetingService.createMeeting(meeting);
    // await notificationService.notifyMeetingCreated(meeting);
    // await calendarService.createEvent(meeting);

    return NextResponse.json(
      { 
        success: true, 
        meeting,
        message: "Meeting created successfully" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating meeting:", error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: "Failed to create meeting" 
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
