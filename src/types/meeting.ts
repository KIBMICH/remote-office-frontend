// API Response Types
export interface MeetingResponse {
  id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number; // in minutes
  timezone?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  maxParticipants?: number;
  metadata?: {
    settings?: {
      enableChat?: boolean;
      enableRecording?: boolean;
      muteOnJoin?: boolean;
    };
    [key: string]: unknown;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  endedAt?: string;
  actualDuration?: number; // in minutes
  participants?: ParticipantResponse[];
}

export interface ParticipantResponse {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  role: 'organizer' | 'presenter' | 'attendee';
  status: 'invited' | 'accepted' | 'declined' | 'joined' | 'left';
  joinedAt?: string;
  leftAt?: string;
  duration?: number; // in minutes
}

export interface MeetingStatsResponse {
  total: number;
  scheduled: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  averageDuration: number; // in minutes
  totalParticipants: number;
}

export interface MeetingSummaryResponse {
  id: string;
  meetingId: string;
  executiveSummary: string;
  keyPoints: string[];
  actionItems: {
    id: string;
    description: string;
    assignedTo?: string;
    dueDate?: string;
    status?: 'pending' | 'in-progress' | 'completed';
  }[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedMeetingsResponse {
  meetings: MeetingResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Payload Types
export interface CreateMeetingPayload {
  title: string;
  description?: string;
  scheduledAt: string; // ISO 8601
  duration: number; // in minutes
  timezone?: string;
  isPublic?: boolean;
  maxParticipants?: number;
  metadata?: {
    settings?: {
      enableChat?: boolean;
      enableRecording?: boolean;
      muteOnJoin?: boolean;
    };
    [key: string]: unknown;
  };
}

export interface UpdateMeetingPayload {
  title?: string;
  description?: string;
  scheduledAt?: string; // ISO 8601
  duration?: number; // in minutes
  timezone?: string;
  isPublic?: boolean;
  maxParticipants?: number;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface AddParticipantsPayload {
  userIds: string[];
  role?: 'organizer' | 'presenter' | 'attendee';
}

export interface UpdateParticipantRolePayload {
  role: 'organizer' | 'presenter' | 'attendee';
}

export interface RespondToInvitationPayload {
  status: 'accepted' | 'declined';
}

export interface RegenerateSummaryPayload {
  force?: boolean;
}

// Query Parameters
export interface GetMeetingsQuery {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'scheduledAt' | 'status' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface GetMeetingStatsQuery {
  userId?: string;
}

// UI Types (for components)
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  duration: number;
  timezone?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  maxParticipants?: number;
  metadata?: Record<string, unknown>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  actualDuration?: number;
  participants?: Participant[];
}

export interface Participant {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  role: 'organizer' | 'presenter' | 'attendee';
  status: 'invited' | 'accepted' | 'declined' | 'joined' | 'left';
  joinedAt?: Date;
  leftAt?: Date;
  duration?: number;
}

export interface MeetingSummary {
  id: string;
  meetingId: string;
  executiveSummary: string;
  keyPoints: string[];
  actionItems: {
    id: string;
    description: string;
    assignedTo?: string;
    dueDate?: Date;
    status?: 'pending' | 'in-progress' | 'completed';
  }[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingStats {
  total: number;
  scheduled: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  averageDuration: number;
  totalParticipants: number;
}


