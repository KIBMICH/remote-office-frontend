"use client";

import React, { useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';

interface ChatMainProps {
  onBackToSidebar?: () => void;
  showBackButton?: boolean;
}

export default function ChatMain({ onBackToSidebar, showBackButton }: ChatMainProps) {
  const { state, loadMessages } = useChatContext();

  const activeChannel = state.channels.find(channel => channel.id === state.activeChannelId);

  // Load messages when active channel changes
  useEffect(() => {
    if (activeChannel?.id) {
      loadMessages(activeChannel.id);
    }
  }, [activeChannel?.id, loadMessages]);

  if (!activeChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Select a chat to start messaging</h3>
          <p className="text-gray-400">Choose from your existing conversations or start a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black w-full h-full overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0">
        <ChatHeader 
          channel={activeChannel} 
          onBackToSidebar={onBackToSidebar}
          showBackButton={showBackButton}
        />
      </div>
      
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        <MessageList channelId={activeChannel.id} />
      </div>
      
      {/* Fixed Input at Bottom */}
      <div className="flex-shrink-0">
        <MessageInput channelId={activeChannel.id} />
      </div>
    </div>
  );
}

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.5-5A8 8 0 1 1 21 12Z" />
    </svg>
  );
}
