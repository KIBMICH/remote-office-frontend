// API Response Types
export interface RtcTokenResponse {
  token: string;
  roomName: string;
  userId: string;
  role: 'publisher' | 'subscriber';
  expiresAt: string; // ISO 8601
}

export interface RtmTokenResponse {
  token: string;
  userId: string;
  expiresAt: string; // ISO 8601
}

export interface RoomAccessResponse {
  hasAccess: boolean;
  meeting?: {
    id: string;
    title: string;
    scheduledAt: string;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    isPublic: boolean;
    maxParticipants?: number;
  };
  message?: string;
}

// Request Payload Types
export interface GenerateRtcTokenPayload {
  roomName: string;
  userId: string;
  role?: 'publisher' | 'subscriber';
}

export interface GenerateRtmTokenPayload {
  userId: string;
}


