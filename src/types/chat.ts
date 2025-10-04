// API Response Types
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  status?: 'online' | 'offline' | 'away';
}

export interface MessageResponse {
  id: string;
  content: string;
  type: 'text' | 'file' | 'image';
  senderId: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  channelId?: string;
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
  isEdited?: boolean;
  timestamp: string; // API uses 'timestamp' not 'createdAt'
  createdAt?: string; // Keep for backward compatibility
  updatedAt?: string;
}

export interface ChannelResponse {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  isPrivate: boolean;
  projectId?: string;
  createdBy: string;
  participants: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: string;
    status?: 'online' | 'offline' | 'away';
  }[];
  lastMessage?: MessageResponse;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Request Payload Types
export interface CreateChannelPayload {
  name: string;
  type: 'direct' | 'group' | 'project';
  participantIds: string[];
  isPrivate?: boolean;
  projectId?: string;
  allowedRoles?: string[];
}

export interface SendMessagePayload {
  content: string;
  type: 'text' | 'file' | 'image';
  replyTo?: string;
}

export interface EditMessagePayload {
  content: string;
}

// UI Types (for components)
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  timestamp: Date;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  isEdited?: boolean;
  replyTo?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isOnline?: boolean;
  projectId?: string;
}

export interface ChatState {
  channels: ChatChannel[];
  activeChannelId: string | null;
  messages: Record<string, Message[]>;
  currentUser: User | null;
  isLoading: boolean;
  searchQuery: string;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface TypingIndicator {
  channelId: string;
  userId: string;
  userName: string;
}

// Pagination Response
export interface MessagesResponse {
  messages: MessageResponse[];
  hasMore: boolean;
  total: number;
}
