import api from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  ChannelResponse,
  MessageResponse,
  UserResponse,
  CreateChannelPayload,
  SendMessagePayload,
  EditMessagePayload,
} from "@/types/chat";

/**
 * Chat Service
 * Handles all chat-related API operations including channels, messages, and user search
 */

// Channel Operations
export const getChannels = async (): Promise<ChannelResponse[]> => {
  const response = await api.get<ChannelResponse[]>(API_ENDPOINTS.CHAT.CHANNELS);
  return response.data;
};

export const createChannel = async (
  payload: CreateChannelPayload
): Promise<ChannelResponse> => {
  const response = await api.post<ChannelResponse>(
    API_ENDPOINTS.CHAT.CREATE_CHANNEL,
    payload
  );
  return response.data;
};

export const joinChannel = async (channelId: string): Promise<void> => {
  const endpoint = API_ENDPOINTS.CHAT.JOIN_CHANNEL.replace(":channelId", channelId);
  await api.post(endpoint);
};

export const leaveChannel = async (channelId: string): Promise<void> => {
  const endpoint = API_ENDPOINTS.CHAT.LEAVE_CHANNEL.replace(":channelId", channelId);
  await api.post(endpoint);
};

export const getChannelUsers = async (channelId: string): Promise<UserResponse[]> => {
  const endpoint = API_ENDPOINTS.CHAT.GET_CHANNEL_USERS.replace(":channelId", channelId);
  const response = await api.get<UserResponse[]>(endpoint);
  return response.data;
};

// Message Operations
export const getChannelMessages = async (
  channelId: string,
  params?: {
    limit?: number;
    offset?: number;
    before?: string;
  }
): Promise<MessageResponse[]> => {
  const endpoint = API_ENDPOINTS.CHAT.GET_CHANNEL_MESSAGES.replace(
    ":channelId",
    channelId
  );
  const response = await api.get<MessageResponse[]>(endpoint, { params });
  return response.data;
};

export const sendMessage = async (
  channelId: string,
  payload: SendMessagePayload
): Promise<MessageResponse> => {
  const endpoint = API_ENDPOINTS.CHAT.SEND_MESSAGE.replace(":channelId", channelId);
  const response = await api.post<MessageResponse>(endpoint, payload);
  return response.data;
};

export const editMessage = async (
  messageId: string,
  payload: EditMessagePayload
): Promise<MessageResponse> => {
  const endpoint = API_ENDPOINTS.CHAT.EDIT_MESSAGE.replace(":messageId", messageId);
  const response = await api.put<MessageResponse>(endpoint, payload);
  return response.data;
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  const endpoint = API_ENDPOINTS.CHAT.DELETE_MESSAGE.replace(":messageId", messageId);
  await api.delete(endpoint);
};

export const markChannelAsRead = async (channelId: string): Promise<void> => {
  const endpoint = API_ENDPOINTS.CHAT.MARK_AS_READ.replace(":channelId", channelId);
  await api.post(endpoint);
};

// User Operations
export const searchUsers = async (query: string): Promise<UserResponse[]> => {
  const response = await api.get<UserResponse[]>(API_ENDPOINTS.CHAT.SEARCH_USERS, {
    params: { q: query },
  });
  return response.data;
};

// File Upload
export const uploadChatFile = async (
  file: File,
  channelId: string
): Promise<{ url: string; fileName: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("channelId", channelId);

  const response = await api.post<{ url: string; fileName: string }>(
    API_ENDPOINTS.CHAT.UPLOAD_FILE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds for file uploads
    }
  );
  return response.data;
};

// Utility Functions for Type Conversion (API Response to UI Types)
export const convertMessageResponse = (msg: MessageResponse) => ({
  id: msg.id,
  content: msg.content,
  senderId: msg.senderId,
  sender: {
    id: msg.sender.id,
    name: msg.sender.name,
    email: msg.sender.email,
    avatarUrl: msg.sender.avatarUrl,
    status: "offline" as const,
  },
  timestamp: new Date(msg.timestamp || msg.createdAt || new Date()),
  type: msg.type,
  fileUrl: msg.fileUrl,
  fileName: msg.fileName,
  isEdited: msg.isEdited,
  replyTo: msg.replyTo,
});

export const convertChannelResponse = (channel: ChannelResponse) => ({
  id: channel.id,
  name: channel.name,
  type: channel.type,
  participants: channel.participants.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    avatarUrl: p.avatarUrl,
    // Use status from API if available, otherwise default to offline
    status: (p as { status?: 'online' | 'offline' | 'away' }).status || "offline" as const,
  })),
  lastMessage: channel.lastMessage
    ? convertMessageResponse(channel.lastMessage)
    : undefined,
  unreadCount: channel.unreadCount,
  projectId: channel.projectId,
});

// Export as default service object for backward compatibility
export const chatService = {
  getChannels,
  createChannel,
  joinChannel,
  leaveChannel,
  getChannelUsers,
  getMessages: getChannelMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead: markChannelAsRead,
  searchUsers,
  uploadFile: uploadChatFile,
  convertMessageResponse,
  convertChannelResponse,
};
