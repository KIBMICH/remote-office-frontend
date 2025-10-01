"use client";

import React, { useState } from 'react';
import { useChatContext } from '@/context/ChatContext';
import Avatar from '@/components/ui/Avatar';

interface ChatSidebarProps {
  onChannelSelect?: (channelId: string) => void;
  selectedChannelId?: string | null;
}

export default function ChatSidebar({ onChannelSelect, selectedChannelId }: ChatSidebarProps) {
  const { state, setActiveChannel, searchChannels } = useChatContext();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');

  const filteredChannels = state.channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'unread':
        return matchesSearch && channel.unreadCount > 0;
      case 'favorites':
        return matchesSearch; // Add favorite logic later
      case 'groups':
        return matchesSearch && channel.type === 'group';
      default:
        return matchesSearch;
    }
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="w-full md:w-80 bg-black border-r border-gray-800 flex flex-col h-full">
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
              onClick={() => setActiveTab(tab.key as any)}
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

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">
            Channels
          </h3>
          {filteredChannels.map((channel) => (
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
                {channel.type === 'direct' && channel.participants.length === 2 ? (
                  <Avatar
                    src={channel.participants.find(p => p.id !== state.currentUser?.id)?.avatarUrl}
                    fallback={channel.participants.find(p => p.id !== state.currentUser?.id)?.name?.charAt(0)}
                    size="sm"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-300">#</span>
                  </div>
                )}
                {channel.type === 'direct' && channel.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                )}
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
          ))}
        </div>

        {/* Direct Messages Section */}
        <div className="p-2 mt-4">
          <div className="flex items-center justify-between px-2 py-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Direct Messages
            </h3>
          </div>
          
          {/* Mock associates list */}
          {[
            { id: 'alice', name: 'Alice Johnson', status: 'Just now', avatar: 'AJ' },
            { id: 'bob', name: 'Bob Smith', status: '11:05 AM', avatar: 'BS' },
            { id: 'team-lead', name: 'Team Lead (You)', status: 'Yesterday', avatar: 'TL' },
            { id: 'product-design', name: 'Product Design Team', status: 'Yesterday', avatar: 'PD' },
          ].map((associate) => (
            <div key={associate.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 cursor-pointer">
              <Avatar
                fallback={associate.avatar}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{associate.name}</p>
                <p className="text-xs text-gray-400">{associate.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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

