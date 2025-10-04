import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    this.socket = io(baseUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      // Handle disconnect silently
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listeners
  on<T = unknown>(event: string, callback: (data: T) => void) {
    this.socket?.on(event, callback as (...args: unknown[]) => void);
  }

  off<T = unknown>(event: string, callback?: (data: T) => void) {
    this.socket?.off(event, callback as (...args: unknown[]) => void);
  }

  // Emit events
  emit(event: string, ...args: unknown[]) {
    this.socket?.emit(event, ...args);
  }

  // Presence events
  onUserStatusChange(callback: (data: { userId: string; status: 'online' | 'offline' | 'away' | 'busy'; lastSeen?: string }) => void) {
    this.on<{ userId: string; status: 'online' | 'offline' | 'away' | 'busy'; lastSeen?: string }>('user_status_change', callback);
  }

  // Legacy methods for backward compatibility (deprecated)
  onUserOnline(callback: (userId: string) => void) {
    this.onUserStatusChange((data) => {
      if (data.status === 'online') {
        callback(data.userId);
      }
    });
  }

  onUserOffline(callback: (userId: string) => void) {
    this.onUserStatusChange((data) => {
      if (data.status === 'offline') {
        callback(data.userId);
      }
    });
  }

  // Chat events
  onNewMessage(callback: (message: unknown) => void) {
    this.on<unknown>('message:new', callback);
  }

  onMessageDeleted(callback: (data: { messageId: string; channelId: string }) => void) {
    this.on<{ messageId: string; channelId: string }>('message:deleted', callback);
  }

  onMessageEdited(callback: (data: { messageId: string; content: string; channelId: string }) => void) {
    this.on<{ messageId: string; content: string; channelId: string }>('message:edited', callback);
  }

  onTypingStart(callback: (data: { userId: string; channelId: string; userName: string }) => void) {
    this.on<{ userId: string; channelId: string; userName: string }>('typing:start', callback);
  }

  onTypingStop(callback: (data: { userId: string; channelId: string }) => void) {
    this.on<{ userId: string; channelId: string }>('typing:stop', callback);
  }

  // Channel events
  onChannelCreated(callback: (channel: unknown) => void) {
    this.on<unknown>('channel:created', callback);
  }

  onChannelUpdated(callback: (channel: unknown) => void) {
    this.on<unknown>('channel:updated', callback);
  }

  onChannelDeleted(callback: (channelId: string) => void) {
    this.on<string>('channel:deleted', callback);
  }

  // Emit typing events
  emitTypingStart(channelId: string) {
    this.emit('typing:start', { channelId });
  }

  emitTypingStop(channelId: string) {
    this.emit('typing:stop', { channelId });
  }

  // Emit status change
  emitStatusChange(status: 'online' | 'offline' | 'away' | 'busy') {
    this.emit('change_status', { status });
  }
}

export const socketService = new SocketService();
export default socketService;
