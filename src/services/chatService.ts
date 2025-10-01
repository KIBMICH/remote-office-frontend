import { ChatChannel, Message, User } from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ChatService {
  private static instance: ChatService;
  private token: string | null = null;

  private constructor() {
    // Get token from localStorage or cookies
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken') || null;
    }
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Channel operations
  async getChannels(): Promise<ChatChannel[]> {
    return this.request<ChatChannel[]>('/chat/channels');
  }

  async createChannel(name: string, type: 'group' | 'direct', participantIds: string[]): Promise<ChatChannel> {
    return this.request<ChatChannel>('/chat/channels', {
      method: 'POST',
      body: JSON.stringify({ name, type, participantIds }),
    });
  }

  async joinChannel(channelId: string): Promise<void> {
    return this.request<void>(`/chat/channels/${channelId}/join`, {
      method: 'POST',
    });
  }

  async leaveChannel(channelId: string): Promise<void> {
    return this.request<void>(`/chat/channels/${channelId}/leave`, {
      method: 'POST',
    });
  }

  // Message operations
  async getMessages(channelId: string, limit = 50, offset = 0): Promise<Message[]> {
    return this.request<Message[]>(`/chat/channels/${channelId}/messages?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(channelId: string, content: string, type: 'text' | 'file' = 'text'): Promise<Message> {
    return this.request<Message>(`/chat/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type }),
    });
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    return this.request<Message>(`/chat/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId: string): Promise<void> {
    return this.request<void>(`/chat/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async markAsRead(channelId: string): Promise<void> {
    return this.request<void>(`/chat/channels/${channelId}/read`, {
      method: 'POST',
    });
  }

  // File upload
  async uploadFile(file: File, channelId: string): Promise<{ url: string; fileName: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('channelId', channelId);

    const response = await fetch(`${API_BASE_URL}/chat/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed! status: ${response.status}`);
    }

    return response.json();
  }

  // User operations
  async searchUsers(query: string): Promise<User[]> {
    return this.request<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async getUsersInChannel(channelId: string): Promise<User[]> {
    return this.request<User[]>(`/chat/channels/${channelId}/users`);
  }

  // Typing indicators
  async sendTypingIndicator(channelId: string): Promise<void> {
    return this.request<void>(`/chat/channels/${channelId}/typing`, {
      method: 'POST',
    });
  }

  async stopTypingIndicator(channelId: string): Promise<void> {
    return this.request<void>(`/chat/channels/${channelId}/typing`, {
      method: 'DELETE',
    });
  }

  // Update token
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }
}

export const chatService = ChatService.getInstance();
