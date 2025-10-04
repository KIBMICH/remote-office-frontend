"use client";

import React, { useState, useEffect } from 'react';
import { ChatProvider } from '@/context/ChatContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatMain from '@/components/chat/ChatMain';

export default function ChatLayout() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [, setSelectedChannel] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, when a channel is selected, hide sidebar and show main chat
  const handleChannelSelect = (channelId: string) => {
    setSelectedChannel(channelId);
    // On mobile screens, hide sidebar when channel is selected
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Function to go back to sidebar on mobile
  const handleBackToSidebar = () => {
    setShowSidebar(true);
    setSelectedChannel(null);
  };

  return (
    <ChatProvider>
      <div className="flex h-full bg-black text-white relative overflow-hidden">
        {/* Sidebar - Full width on mobile when visible, fixed width on desktop */}
        <div className={`
          ${showSidebar || !isMobile ? 'flex' : 'hidden'} 
          w-full md:w-80 
          flex-shrink-0 
          transition-all duration-300 ease-in-out
          ${isMobile && !showSidebar ? 'absolute inset-0 z-10' : ''}
        `}>
          <ChatSidebar 
            onChannelSelect={handleChannelSelect}
          />
        </div>

        {/* Main Chat - Hidden on mobile when sidebar visible, always visible on desktop */}
        <div className={`
          ${!showSidebar || !isMobile ? 'flex' : 'hidden'} 
          flex-1 
          transition-all duration-300 ease-in-out
          ${isMobile && showSidebar ? 'absolute inset-0' : ''}
        `}>
          <ChatMain 
            onBackToSidebar={handleBackToSidebar}
            showBackButton={isMobile && !showSidebar}
          />
        </div>
      </div>
    </ChatProvider>
  );
}
