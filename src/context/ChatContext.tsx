"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, ChatChannel, Message, User, TypingIndicator } from '@/types/chat';

interface ChatContextType {
  state: ChatState;
  setActiveChannel: (channelId: string) => void;
  sendMessage: (content: string, channelId: string) => void;
  searchChannels: (query: string) => void;
  markAsRead: (channelId: string) => void;
  addTypingIndicator: (indicator: TypingIndicator) => void;
  removeTypingIndicator: (channelId: string, userId: string) => void;
}

type ChatAction =
  | { type: 'SET_CHANNELS'; payload: ChatChannel[] }
  | { type: 'SET_ACTIVE_CHANNEL'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { channelId: string; message: Message } }
  | { type: 'SET_MESSAGES'; payload: { channelId: string; messages: Message[] } }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'UPDATE_CHANNEL'; payload: ChatChannel };

const initialState: ChatState = {
  channels: [],
  activeChannelId: null,
  messages: {},
  currentUser: null,
  isLoading: false,
  searchQuery: '',
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };
    
    case 'SET_ACTIVE_CHANNEL':
      return { ...state, activeChannelId: action.payload };
    
    case 'ADD_MESSAGE':
      const { channelId, message } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [channelId]: [...(state.messages[channelId] || []), message],
        },
        channels: state.channels.map(channel =>
          channel.id === channelId
            ? { ...channel, lastMessage: message, unreadCount: channel.id === state.activeChannelId ? 0 : channel.unreadCount + 1 }
            : channel
        ),
      };
    
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.channelId]: action.payload.messages,
        },
      };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'MARK_AS_READ':
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.payload ? { ...channel, unreadCount: 0 } : channel
        ),
      };
    
    case 'UPDATE_CHANNEL':
      return {
        ...state,
        channels: state.channels.map(channel =>
          channel.id === action.payload.id ? action.payload : channel
        ),
      };
    
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Mock data initialization
  useEffect(() => {
    // Initialize with mock data
    const mockUser: User = {
      id: 'current-user',
      name: 'Current User',
      email: 'user@example.com',
      status: 'online',
    };

    const mockChannels: ChatChannel[] = [
      {
        id: 'general',
        name: '#general',
        type: 'group',
        participants: [
          mockUser,
          { id: 'alice', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
          { id: 'bob', name: 'Bob Smith', email: 'bob@example.com', status: 'online' },
        ],
        unreadCount: 0,
        lastMessage: {
          id: 'msg1',
          content: 'Project update meeting at 2 PM',
          senderId: 'alice',
          sender: { id: 'alice', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
          timestamp: new Date('2024-01-01T10:20:00'),
          type: 'text',
        },
      },
      {
        id: 'marketing-campaign',
        name: '#marketing-campaign',
        type: 'group',
        participants: [
          mockUser,
          { id: 'alice', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
        ],
        unreadCount: 0,
        lastMessage: {
          id: 'msg2',
          content: 'Review our latest marketing campaign.',
          senderId: 'alice',
          sender: { id: 'alice', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
          timestamp: new Date('2024-01-01T09:15:00'),
          type: 'text',
        },
      },
      {
        id: 'project-launchpad',
        name: '#project-launchpad',
        type: 'project',
        participants: [
          mockUser,
          { id: 'alice', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
          { id: 'bob', name: 'Bob Smith', email: 'bob@example.com', status: 'online' },
        ],
        unreadCount: 1,
        projectId: 'proj-1',
        lastMessage: {
          id: 'msg3',
          content: 'Review our latest launch timeline.',
          senderId: 'bob',
          sender: { id: 'bob', name: 'Bob Smith', email: 'bob@example.com', status: 'online' },
          timestamp: new Date('2024-01-01T08:45:00'),
          type: 'text',
        },
      },
      {
        id: 'random',
        name: '#random',
        type: 'group',
        participants: [mockUser],
        unreadCount: 0,
        lastMessage: {
          id: 'msg4',
          content: 'Share your favorite productivity hacks!',
          senderId: 'current-user',
          sender: mockUser,
          timestamp: new Date('2024-01-01T07:30:00'),
          type: 'text',
        },
      },
    ];

    dispatch({ type: 'SET_CURRENT_USER', payload: mockUser });
    dispatch({ type: 'SET_CHANNELS', payload: mockChannels });
    dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: 'project-launchpad' });

    // Mock messages for active channel
    const mockMessages: Message[] = [
      {
        id: 'msg1',
        content: 'My tasks are all done! Uploading the final report now.',
        senderId: 'alice',
        sender: { id: 'alice', name: 'Alice Johnson', email: 'alice@example.com', status: 'online' },
        timestamp: new Date('2024-01-01T08:20:00'),
        type: 'text',
      },
      {
        id: 'msg2',
        content: 'Great work, Alice! My end is also complete. Ready for launch!',
        senderId: 'bob',
        sender: { id: 'bob', name: 'Bob Smith', email: 'bob@example.com', status: 'online' },
        timestamp: new Date('2024-01-01T08:30:00'),
        type: 'text',
      },
      {
        id: 'msg3',
        content: 'Excellent! Let\'s aim for a smooth launch. I\'ll send out the final confirmation shortly.',
        senderId: 'current-user',
        sender: mockUser,
        timestamp: new Date('2024-01-01T08:33:00'),
        type: 'text',
      },
    ];

    dispatch({ type: 'SET_MESSAGES', payload: { channelId: 'project-launchpad', messages: mockMessages } });
  }, []);

  const setActiveChannel = (channelId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: channelId });
    dispatch({ type: 'MARK_AS_READ', payload: channelId });
  };

  const sendMessage = (content: string, channelId: string) => {
    if (!state.currentUser || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: content.trim(),
      senderId: state.currentUser.id,
      sender: state.currentUser,
      timestamp: new Date(),
      type: 'text',
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { channelId, message: newMessage } });
  };

  const searchChannels = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const markAsRead = (channelId: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: channelId });
  };

  const addTypingIndicator = (indicator: TypingIndicator) => {
    // Implementation for typing indicators
  };

  const removeTypingIndicator = (channelId: string, userId: string) => {
    // Implementation for removing typing indicators
  };

  return (
    <ChatContext.Provider
      value={{
        state,
        setActiveChannel,
        sendMessage,
        searchChannels,
        markAsRead,
        addTypingIndicator,
        removeTypingIndicator,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
