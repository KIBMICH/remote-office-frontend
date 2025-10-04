import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    console.log('Connecting to Socket.IO server:', baseUrl);

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
      console.log('✅ Socket.IO connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket.IO error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket...');
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
  onUserOnline(callback: (userId: string) => void) {
    this.on<string>('user:online', callback);
  }

  onUserOffline(callback: (userId: string) => void) {
    this.on<string>('user:offline', callback);
  }

  onUserStatusChange(callback: (data: { userId: string; status: 'online' | 'offline' | 'away' }) => void) {
    this.on<{ userId: string; status: 'online' | 'offline' | 'away' }>('user:status', callback);
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
}

export const socketService = new SocketService();
export default socketService;
