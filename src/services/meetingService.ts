import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  MeetingResponse,
  ParticipantResponse,
  MeetingStatsResponse,
  MeetingSummaryResponse,
  PaginatedMeetingsResponse,
  CreateMeetingPayload,
  UpdateMeetingPayload,
  AddParticipantsPayload,
  UpdateParticipantRolePayload,
  RespondToInvitationPayload,
  RegenerateSummaryPayload,
  GetMeetingsQuery,
  GetMeetingStatsQuery,
  Meeting,
  Participant,
  MeetingSummary,
  MeetingStats,
} from "@/types/meeting";

/**
 * Meeting Service
 * Handles all meeting-related API operations including CRUD, participants, and summaries
 */

// Statistics
export const getMeetingStats = async (
  query?: GetMeetingStatsQuery
): Promise<MeetingStatsResponse> => {
  const response = await api.get<MeetingStatsResponse>(API_ENDPOINTS.MEETINGS.STATS, {
    params: query,
  });
  return response.data;
};

// Meeting CRUD Operations
export const getMeetings = async (
  query?: GetMeetingsQuery
): Promise<PaginatedMeetingsResponse> => {
  const response = await api.get<PaginatedMeetingsResponse>(API_ENDPOINTS.MEETINGS.LIST, {
    params: query,
  });
  return response.data;
};

export const getMeetingById = async (meetingId: string): Promise<MeetingResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.GET.replace(":meetingId", meetingId);
  const response = await api.get<MeetingResponse>(endpoint);
  return response.data;
};

export const createMeeting = async (
  payload: CreateMeetingPayload
): Promise<MeetingResponse> => {
  const response = await api.post<{ meeting?: MeetingResponse; message?: string } | MeetingResponse>(
    API_ENDPOINTS.MEETINGS.CREATE, 
    payload
  );
  
  // Handle nested response structure: { message: "...", meeting: {...} } or direct meeting object
  const rawData = response.data;
  let meetingData = (rawData as { meeting?: MeetingResponse }).meeting || rawData as MeetingResponse;
  
  // Normalize _id to id if backend returns MongoDB format
  if ((meetingData as { _id?: string })._id && !meetingData.id) {
    meetingData = {
      ...meetingData,
      id: (meetingData as { _id: string })._id,
    } as MeetingResponse;
  }
  
  return meetingData as MeetingResponse;
};

export const updateMeeting = async (
  meetingId: string,
  payload: UpdateMeetingPayload
): Promise<MeetingResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.UPDATE.replace(":meetingId", meetingId);
  const response = await api.put<MeetingResponse>(endpoint, payload);
  return response.data;
};

export const deleteMeeting = async (meetingId: string): Promise<void> => {
  const endpoint = API_ENDPOINTS.MEETINGS.DELETE.replace(":meetingId", meetingId);
  await api.delete(endpoint);
};

// Meeting Lifecycle Operations
export const startMeeting = async (meetingId: string): Promise<MeetingResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.START.replace(":meetingId", meetingId);
  const response = await api.post<MeetingResponse>(endpoint);
  return response.data;
};

export const endMeeting = async (meetingId: string): Promise<MeetingResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.END.replace(":meetingId", meetingId);
  const response = await api.post<MeetingResponse>(endpoint);
  return response.data;
};

// Participant Operations
export const getMeetingParticipants = async (
  meetingId: string
): Promise<ParticipantResponse[]> => {
  const endpoint = API_ENDPOINTS.MEETINGS.PARTICIPANTS.replace(":meetingId", meetingId);
  const response = await api.get<ParticipantResponse[]>(endpoint);
  return response.data;
};

export const addParticipants = async (
  meetingId: string,
  payload: AddParticipantsPayload
): Promise<ParticipantResponse[]> => {
  const endpoint = API_ENDPOINTS.MEETINGS.ADD_PARTICIPANTS.replace(":meetingId", meetingId);
  const response = await api.post<ParticipantResponse[]>(endpoint, payload);
  return response.data;
};

export const removeParticipant = async (
  meetingId: string,
  userId: string
): Promise<void> => {
  let endpoint = API_ENDPOINTS.MEETINGS.REMOVE_PARTICIPANT.replace(":meetingId", meetingId);
  endpoint = endpoint.replace(":userId", userId);
  await api.delete(endpoint);
};

export const updateParticipantRole = async (
  meetingId: string,
  userId: string,
  payload: UpdateParticipantRolePayload
): Promise<ParticipantResponse> => {
  let endpoint = API_ENDPOINTS.MEETINGS.UPDATE_PARTICIPANT_ROLE.replace(":meetingId", meetingId);
  endpoint = endpoint.replace(":userId", userId);
  const response = await api.patch<ParticipantResponse>(endpoint, payload);
  return response.data;
};

// Join/Leave Operations
export const joinMeeting = async (meetingId: string): Promise<ParticipantResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.JOIN.replace(":meetingId", meetingId);
  const response = await api.post<ParticipantResponse>(endpoint);
  return response.data;
};

export const leaveMeeting = async (meetingId: string): Promise<ParticipantResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.LEAVE.replace(":meetingId", meetingId);
  const response = await api.post<ParticipantResponse>(endpoint);
  return response.data;
};

// Invitation Operations
export const respondToInvitation = async (
  meetingId: string,
  payload: RespondToInvitationPayload
): Promise<ParticipantResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.RESPOND.replace(":meetingId", meetingId);
  const response = await api.post<ParticipantResponse>(endpoint, payload);
  return response.data;
};

// Summary Operations
export const getMeetingSummary = async (
  meetingId: string
): Promise<MeetingSummaryResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.SUMMARY.replace(":meetingId", meetingId);
  const response = await api.get<MeetingSummaryResponse>(endpoint);
  return response.data;
};

export const regenerateMeetingSummary = async (
  meetingId: string,
  payload?: RegenerateSummaryPayload
): Promise<MeetingSummaryResponse> => {
  const endpoint = API_ENDPOINTS.MEETINGS.REGENERATE_SUMMARY.replace(":meetingId", meetingId);
  const response = await api.post<MeetingSummaryResponse>(endpoint, payload);
  return response.data;
};

// Utility Functions for Type Conversion (API Response to UI Types)
export const convertMeetingResponse = (meeting: MeetingResponse): Meeting => ({
  id: meeting.id,
  title: meeting.title,
  description: meeting.description,
  scheduledAt: new Date(meeting.scheduledAt),
  duration: meeting.duration,
  timezone: meeting.timezone,
  status: meeting.status,
  isPublic: meeting.isPublic,
  maxParticipants: meeting.maxParticipants,
  metadata: meeting.metadata,
  createdBy: meeting.createdBy,
  createdAt: new Date(meeting.createdAt),
  updatedAt: new Date(meeting.updatedAt),
  startedAt: meeting.startedAt ? new Date(meeting.startedAt) : undefined,
  endedAt: meeting.endedAt ? new Date(meeting.endedAt) : undefined,
  actualDuration: meeting.actualDuration,
  participants: meeting.participants?.map(convertParticipantResponse),
});

export const convertParticipantResponse = (participant: ParticipantResponse): Participant => ({
  userId: participant.userId,
  user: {
    id: participant.user.id,
    name: participant.user.name,
    email: participant.user.email,
    avatarUrl: participant.user.avatarUrl,
  },
  role: participant.role,
  status: participant.status,
  joinedAt: participant.joinedAt ? new Date(participant.joinedAt) : undefined,
  leftAt: participant.leftAt ? new Date(participant.leftAt) : undefined,
  duration: participant.duration,
});

export const convertMeetingSummaryResponse = (
  summary: MeetingSummaryResponse
): MeetingSummary => ({
  id: summary.id,
  meetingId: summary.meetingId,
  executiveSummary: summary.executiveSummary,
  keyPoints: summary.keyPoints,
  actionItems: summary.actionItems.map((item) => ({
    id: item.id,
    description: item.description,
    assignedTo: item.assignedTo,
    dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
    status: item.status,
  })),
  tags: summary.tags,
  createdAt: new Date(summary.createdAt),
  updatedAt: new Date(summary.updatedAt),
});

// Export as default service object for backward compatibility
export const meetingService = {
  getStats: getMeetingStats,
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  startMeeting,
  endMeeting,
  getParticipants: getMeetingParticipants,
  addParticipants,
  removeParticipant,
  updateParticipantRole,
  joinMeeting,
  leaveMeeting,
  respondToInvitation,
  getSummary: getMeetingSummary,
  regenerateSummary: regenerateMeetingSummary,
  convertMeetingResponse,
  convertParticipantResponse,
  convertMeetingSummaryResponse,
};

export default meetingService;


