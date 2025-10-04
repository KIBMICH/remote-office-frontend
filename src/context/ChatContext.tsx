"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, ChatChannel, Message, User, TypingIndicator } from '@/types/chat';
import { chatService } from '@/services/chatService';
import { useAuthContext } from '@/context/AuthContext';

interface ChatContextType {
  state: ChatState;
  setActiveChannel: (channelId: string) => void;
  sendMessage: (content: string, channelId: string) => Promise<void>;
  searchChannels: (query: string) => void;
  markAsRead: (channelId: string) => void;
  addTypingIndicator: (indicator: TypingIndicator) => void;
  removeTypingIndicator: (channelId: string, userId: string) => void;
  refreshChannels: () => Promise<void>;
  loadMessages: (channelId: string) => Promise<void>;
  deleteMessage: (messageId: string, channelId: string) => Promise<void>;
  editMessage: (messageId: string, content: string, channelId: string) => Promise<void>;
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
  | { type: 'UPDATE_CHANNEL'; payload: ChatChannel }
  | { type: 'DELETE_MESSAGE'; payload: { channelId: string; messageId: string } }
  | { type: 'UPDATE_MESSAGE'; payload: { channelId: string; messageId: string; content: string } };

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
    
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.channelId]: (state.messages[action.payload.channelId] || []).filter(
            msg => msg.id !== action.payload.messageId
          ),
        },
      };
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.channelId]: (state.messages[action.payload.channelId] || []).map(
            msg => msg.id === action.payload.messageId
              ? { ...msg, content: action.payload.content, isEdited: true }
              : msg
          ),
        },
      };
    
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuthContext();
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize with real data from API
  useEffect(() => {
    const initializeChat = async () => {
      // Only initialize once when user is available
      if (!user || isInitialized || state.isLoading) return;

      setIsInitialized(true);

      // Set current user (always needed for chat to work)
      const currentUser: User = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatarUrl: user.avatarUrl,
        status: 'online',
      };
      dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });

      // Fetch channels from API with rate limit protection
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const channelsResponse = await chatService.getChannels();
        const channels = channelsResponse.map(chatService.convertChannelResponse);
        dispatch({ type: 'SET_CHANNELS', payload: channels });
      } catch (error: unknown) {
        console.error('Error loading channels:', error);
        const errorData = error as { response?: { status?: number } };
        
        // Handle rate limit error - set empty channels to prevent UI break
        if (errorData?.response?.status === 429) {
          console.warn('⚠️ Rate limit exceeded. Please wait a few minutes before refreshing.');
          console.warn('The chat will be available once the rate limit resets.');
          dispatch({ type: 'SET_CHANNELS', payload: [] });
        } else {
          // For other errors, also set empty channels
          dispatch({ type: 'SET_CHANNELS', payload: [] });
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeChat();
  }, [user, isInitialized, state.isLoading]);

  const setActiveChannel = (channelId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: channelId });
    dispatch({ type: 'MARK_AS_READ', payload: channelId });
  };

  const sendMessage = async (content: string, channelId: string) => {
    if (!state.currentUser || !content.trim()) return;

    try {
      const messageResponse = await chatService.sendMessage(channelId, {
        content: content.trim(),
        type: 'text',
      });

      const newMessage = chatService.convertMessageResponse(messageResponse);
      dispatch({ type: 'ADD_MESSAGE', payload: { channelId, message: newMessage } });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const searchChannels = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const markAsRead = async (channelId: string) => {
    try {
      await chatService.markAsRead(channelId);
      dispatch({ type: 'MARK_AS_READ', payload: channelId });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const addTypingIndicator = (_indicator: TypingIndicator) => {
    // Implementation for typing indicators
  };

  const removeTypingIndicator = (_channelId: string, _userId: string) => {
    // Implementation for removing typing indicators
  };

  const refreshChannels = async () => {
    // Prevent multiple simultaneous refresh calls
    if (state.isLoading) {
      console.warn('Already loading channels, skipping refresh');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const channelsResponse = await chatService.getChannels();
      const channels = channelsResponse.map(chatService.convertChannelResponse);
      dispatch({ type: 'SET_CHANNELS', payload: channels });
    } catch (error: unknown) {
      console.error('Error refreshing channels:', error);
      const errorData = error as { response?: { status?: number } };
      
      // Handle rate limit error
      if (errorData?.response?.status === 429) {
        console.warn('Rate limit exceeded. Please wait before refreshing again.');
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const messagesResponse = await chatService.getMessages(channelId, {
        limit: 50,
        offset: 0,
      });
      const messages = messagesResponse.map(chatService.convertMessageResponse);
      dispatch({ type: 'SET_MESSAGES', payload: { channelId, messages } });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const deleteMessage = async (messageId: string, channelId: string) => {
    try {
      await chatService.deleteMessage(messageId);
      dispatch({ type: 'DELETE_MESSAGE', payload: { channelId, messageId } });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const editMessage = async (messageId: string, content: string, channelId: string) => {
    try {
      await chatService.editMessage(messageId, { content });
      dispatch({ type: 'UPDATE_MESSAGE', payload: { channelId, messageId, content } });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
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
        refreshChannels,
        loadMessages,
        deleteMessage,
        editMessage,
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
