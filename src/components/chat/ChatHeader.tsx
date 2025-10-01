"use client";

import React from 'react';
import { ChatChannel } from '@/types/chat';
import Avatar from '@/components/ui/Avatar';

interface ChatHeaderProps {
  channel: ChatChannel;
  onBackToSidebar?: () => void;
  showBackButton?: boolean;
}

export default function ChatHeader({ channel, onBackToSidebar, showBackButton }: ChatHeaderProps) {
  const getChannelDisplayName = () => {
    if (channel.type === 'direct' && channel.participants.length === 2) {
      return channel.participants.find(p => p.id !== 'current-user')?.name || 'Unknown User';
    }
    return channel.name;
  };

  const getOnlineCount = () => {
    return channel.participants.filter(p => p.status === 'online').length;
  };

  return (
    <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-800 bg-black">
      <div className="flex items-center gap-3">
        {/* Back button for mobile */}
        {showBackButton && (
          <button
            onClick={onBackToSidebar}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
          </button>
        )}
        <div className="relative">
          {channel.type === 'direct' && channel.participants.length === 2 ? (
            <Avatar
              src={channel.participants.find(p => p.id !== 'current-user')?.avatarUrl}
              fallback={channel.participants.find(p => p.id !== 'current-user')?.name?.charAt(0)}
              size="md"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-300">#</span>
            </div>
          )}
          {channel.type === 'direct' && channel.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-white truncate">
            {getChannelDisplayName()}
          </h2>
          <p className="text-xs md:text-sm text-gray-400 truncate">
            {channel.type === 'direct' 
              ? channel.isOnline ? 'Online' : 'Offline'
              : `${getOnlineCount()} online • ${channel.participants.length} members`
            }
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <button className="p-1.5 md:p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <PhoneIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </button>
        <button className="p-1.5 md:p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <VideoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </button>
        <button className="p-1.5 md:p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <InfoIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </button>
      </div>
    </div>
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

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
