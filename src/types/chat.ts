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
