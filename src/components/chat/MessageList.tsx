"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { Message } from '@/types/chat';
// Avatar removed to match WhatsApp-style (no initials next to messages)

interface MessageListProps {
  channelId: string;
}

export default function MessageList({ channelId }: MessageListProps) {
  const { state } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserNearBottomRef = useRef<boolean>(true);
  const messages = useMemo(() => state.messages[channelId] || [], [state.messages, channelId]);

  const scrollToBottom = () => {
    // Prefer container scroll when available to avoid layout quirks
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    // Only autoscroll if user is already near bottom
    if (isUserNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      isUserNearBottomRef.current = distanceFromBottom < 80; // px threshold
    };

    // Initialize near-bottom state and ensure initial scroll to bottom
    onScroll();
    scrollToBottom();

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  const shouldGroupMessage = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return false;
    
    const timeDiff = new Date(currentMessage.timestamp).getTime() - new Date(previousMessage.timestamp).getTime();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (
      currentMessage.senderId === previousMessage.senderId &&
      timeDiff < fiveMinutes
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
          <p className="text-gray-400">Start the conversation by sending a message below.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="flex-1 h-full overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
      {messages.map((message, index) => {
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
        const isGrouped = shouldGroupMessage(message, previousMessage);
        const isCurrentUser = message.senderId === state.currentUser?.id;

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <div className="flex items-center justify-center my-6">
                <div className="bg-gray-800 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-400">
                    {formatDate(new Date(message.timestamp))}
                  </span>
                </div>
              </div>
            )}
            
            <div className={`flex gap-3 ${isGrouped ? 'mt-1' : 'mt-4'}`}>
              <div className="flex-shrink-0">
                <div className="w-8 h-8" />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Timestamp will be shown inside the bubble at the top */}
                <div className={`${isCurrentUser ? 'ml-auto max-w-[85%] sm:max-w-[70%]' : 'max-w-[90%] sm:max-w-[85%]'}`}>
                  {message.type === 'text' ? (
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        isCurrentUser
                          ? 'bg-blue-800 text-white ml-auto'
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <div className={`text-[10px] mb-1 ${isCurrentUser ? 'text-white/60' : 'text-gray-400'} text-right`}>
                        {formatTime(new Date(message.timestamp))}
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      {message.isEdited && (
                        <span className="text-xs opacity-70 ml-2">(edited)</span>
                      )}
                    </div>
                  ) : message.type === 'file' ? (
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="text-[10px] mb-1 text-gray-400 text-right">
                        {formatTime(new Date(message.timestamp))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {message.fileName}
                          </p>
                          <p className="text-xs text-gray-400">File attachment</p>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.5-5A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
