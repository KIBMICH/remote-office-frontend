"use client";

import React, { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import Avatar from '@/components/ui/Avatar';
import AddChannelModal from '@/components/chat/AddChannelModal';
import { chatService } from '@/services/chatService';
import { useToast } from '@/components/ui/ToastProvider';

interface ChatSidebarProps {
  onChannelSelect?: (channelId: string) => void;
}

export default function ChatSidebar({ onChannelSelect }: ChatSidebarProps) {
  const { state, setActiveChannel, searchChannels, refreshChannels } = useChatContext();
  const { error: toastError, success: toastSuccess } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');
  const [isAddChannelModalOpen, setIsAddChannelModalOpen] = useState(false);
  const [dmSearchQuery, setDmSearchQuery] = useState('');
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; email: string; avatarUrl?: string }>>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const filteredChannels = state.channels.filter(channel => {
    // For channels section, only show group and project channels (not direct messages)
    const isGroupOrProject = channel.type === 'group' || channel.type === 'project';
    const matchesSearch = channel.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'unread':
        return isGroupOrProject && matchesSearch && channel.unreadCount > 0;
      case 'favorites':
        return isGroupOrProject && matchesSearch; // Add favorite logic later
      case 'groups':
        return matchesSearch && channel.type === 'group';
      default:
        return isGroupOrProject && matchesSearch;
    }
  });

  // Search for users to start direct messages
  useEffect(() => {
    const searchUsers = async () => {
      if (dmSearchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      // Skip search if we've detected rate limiting
      if (isRateLimited) {
        return;
      }

      setSearchingUsers(true);
      try {
        const users = await chatService.searchUsers(dmSearchQuery);
        setSearchResults(users);
      } catch (error) {
        console.error('Error searching users:', error);
        const errorData = error as { response?: { status?: number } };
        
        // Handle rate limit gracefully - stop making requests
        if (errorData?.response?.status === 429) {
          console.warn('⚠️ Rate limit exceeded for user search. Feature temporarily disabled.');
          setIsRateLimited(true);
        }
        setSearchResults([]);
      } finally {
        setSearchingUsers(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [dmSearchQuery, isRateLimited]);

  // Handle creating or opening a direct message
  const handleStartDirectMessage = async (userId: string) => {
    try {
      // Check if a DM already exists with this user
      const existingDM = state.channels.find(
        ch => ch.type === 'direct' && ch.participants.some(p => p.id === userId)
      );

      if (existingDM) {
        // Open existing DM
        setActiveChannel(existingDM.id);
        onChannelSelect?.(existingDM.id);
        // Clear search
        setDmSearchQuery('');
        setSearchResults([]);
      } else {
        // Find the user details for the channel name
        const selectedUser = searchResults.find(u => u.id === userId);
        const channelName = selectedUser ? `DM with ${selectedUser.name}` : 'Direct Chat';
        
        const payload = {
          name: channelName,
          type: 'direct' as const,
          participantIds: [userId],
        };
        
        console.log('Creating direct channel with payload:', JSON.stringify(payload, null, 2));
        console.log('Payload type check:', {
          name: typeof payload.name,
          type: typeof payload.type,
          participantIds: Array.isArray(payload.participantIds),
          participantIdsLength: payload.participantIds.length,
          firstParticipantId: payload.participantIds[0]
        });
        
        // Create new DM - direct channels don't need isPrivate field
        const newChannel = await chatService.createChannel(payload);
        
        console.log('Direct channel created:', newChannel);
        
        // Refresh channels to get the new DM
        if (refreshChannels) {
          await refreshChannels();
        }
        
        // Open the new DM
        setActiveChannel(newChannel.id);
        onChannelSelect?.(newChannel.id);
        
        // Clear search
        setDmSearchQuery('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error creating direct message:', error);
      const errorData = error as { response?: { data?: unknown; status?: number; statusText?: string } };
      console.error('Error status:', errorData?.response?.status);
      console.error('Error details:', errorData?.response?.data);
      
      // Show specific error message based on status
      if (errorData?.response?.status === 400) {
        const errorMsg = errorData?.response?.data as { message?: string };
        
        // If channel already exists, try to refresh and find it
        if (errorMsg?.message?.includes('already exists')) {
          toastError('A chat with this user already exists. Refreshing channels...');
          
          // Try to refresh channels to get the existing DM
          if (refreshChannels) {
            try {
              await refreshChannels();
              
              // After refresh, try to find and open the existing DM
              const existingDM = state.channels.find(
                ch => ch.type === 'direct' && ch.participants.some(p => p.id === userId)
              );
              
              if (existingDM) {
                setActiveChannel(existingDM.id);
                onChannelSelect?.(existingDM.id);
                toastSuccess('Opened existing chat');
              } else {
                toastError('Please refresh the page to see your existing chat with this user.');
              }
            } catch (refreshError) {
              console.error('Error refreshing channels:', refreshError);
              toastError('Please refresh the page to see your existing chat with this user.');
            }
          } else {
            toastError('Please refresh the page to see your existing chat with this user.');
          }
          
          // Clear search
          setDmSearchQuery('');
          setSearchResults([]);
        } else {
          toastError(errorMsg?.message || 'Invalid request. Please check the user and try again.');
        }
      } else if (errorData?.response?.status === 429) {
        toastError('Rate limit exceeded. Please wait a few minutes and try again.');
      } else if (errorData?.response?.status === 404) {
        toastError('User not found. Please try searching again.');
      } else {
        toastError('Failed to create direct message. Please try again.');
      }
    }
  };

  const formatTime = (date: Date) => {
    // Check if date is valid
    if (!date || isNaN(date.getTime())) {
      return '';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    // For older messages, show the date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full md:w-80 bg-black border-r border-gray-800 flex flex-col h-full overflow-hidden">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-white">Chats</h1>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <VideoIcon className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <DotsIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={state.searchQuery}
              onChange={(e) => searchChannels(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 border-b border-gray-800">
          <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'favorites', label: 'Favorites' },
              { key: 'groups', label: 'Groups' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'all' | 'unread' | 'favorites' | 'groups')}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Channels List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Channels
            </h3>
            <button
              onClick={() => setIsAddChannelModalOpen(true)}
              className="p-1 hover:bg-gray-800 rounded transition-colors group"
              title="Create new channel"
            >
              <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
          </div>
          
          {state.isLoading ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              Loading channels...
            </div>
          ) : filteredChannels.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">No channels yet</p>
              <p className="text-gray-500 text-xs">
                Click the + button to create a channel
              </p>
            </div>
          ) : (
            filteredChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                setActiveChannel(channel.id);
                onChannelSelect?.(channel.id);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                state.activeChannelId === channel.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-900'
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-300">#</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">
                    {channel.name}
                  </h4>
                  {channel.lastMessage && (
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(channel.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {channel.lastMessage && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {channel.lastMessage.sender.name === state.currentUser?.name ? 'You: ' : ''}
                    {channel.lastMessage.content}
                  </p>
                )}
              </div>
              
              {channel.unreadCount > 0 && (
                <div className="bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                </div>
              )}
            </button>
          ))
          )}
        </div>

        {/* Direct Messages Section */}
        <div className="p-2 mt-4">
          <div className="px-2 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Direct Messages
            </h3>
            {/* Search field for finding users */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={dmSearchQuery}
                onChange={(e) => setDmSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* User search results */}
          {dmSearchQuery.trim().length >= 2 && (
            <div className="mb-2">
              {isRateLimited ? (
                <div className="px-3 py-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                  <p className="text-xs text-yellow-400 font-medium mb-1">⚠️ Rate Limit Reached</p>
                  <p className="text-xs text-gray-400">
                    Too many requests. Please wait a few minutes and refresh the page to try again.
                  </p>
                </div>
              ) : searchingUsers ? (
                <div className="px-2 py-2 text-xs text-gray-400">Searching...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartDirectMessage(user.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Avatar
                        src={user.avatarUrl}
                        fallback={user.name.charAt(0).toUpperCase()}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-2 py-2 text-xs text-gray-400">
                  No users found. Try a different search term.
                </div>
              )}
            </div>
          )}
          
          {state.channels.filter(ch => ch.type === 'direct').length > 0 ? (
            state.channels
              .filter(ch => ch.type === 'direct')
              .map((channel) => {
                const otherUser = channel.participants.find(p => p.id !== state.currentUser?.id);
                return (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannel(channel.id);
                      onChannelSelect?.(channel.id);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      state.activeChannelId === channel.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-900'
                    }`}
                  >
                    <Avatar
                      src={otherUser?.avatarUrl}
                      fallback={otherUser?.name?.charAt(0).toUpperCase()}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-white truncate">
                        {otherUser?.name || 'Unknown User'}
                      </p>
                      {channel.lastMessage && (
                        <p className="text-xs text-gray-400 truncate">
                          {formatTime(channel.lastMessage.timestamp)}
                        </p>
                      )}
                    </div>
                    {channel.unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                      </div>
                    )}
                  </button>
                );
              })
          ) : dmSearchQuery.trim().length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">
              Search for users to start a conversation
            </p>
          ) : null}
        </div>
      </div>

      {/* Add Channel Modal */}
      <AddChannelModal
        isOpen={isAddChannelModalOpen}
        onClose={() => setIsAddChannelModalOpen(false)}
      />
    </div>
  );
}

// Icons
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function DotsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

