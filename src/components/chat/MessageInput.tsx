"use client";

import React, { useState, useRef, KeyboardEvent } from 'react';
import dynamic from 'next/dynamic';
import { Theme, EmojiStyle } from 'emoji-picker-react';
import { useChatContext } from '@/context/ChatContext';
import Button from '@/components/ui/Button';

// Dynamically import emoji picker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface MessageInputProps {
  channelId: string;
}

export default function MessageInput({ channelId }: MessageInputProps) {
  const { sendMessage } = useChatContext();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message, channelId);
      setMessage('');
      setIsTyping(false);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setIsTyping(value.length > 0);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file.name);
      // You would typically upload the file and then send a message with file info
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = message;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + emojiData.emoji + after;

    setMessage(newText);
    setIsTyping(newText.length > 0);

    // Close emoji picker on mobile after selection
    if (isMobile) {
      setShowEmojiPicker(false);
    }

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + emojiData.emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close emoji picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="border-t border-gray-800 bg-black">
      <div className="p-3 md:p-4">
        <div className="flex items-end gap-2 md:gap-3">
          {/* File Upload */}
          <div className="flex-shrink-0">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <div className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <PaperclipIcon className="w-5 h-5 text-gray-400" />
              </div>
            </label>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors"
              rows={1}
              style={{ 
                minHeight: '44px', 
                maxHeight: '120px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif'
              }}
            />
            
            {/* Emoji Button */}
            <button 
              type="button"
              onClick={toggleEmojiPicker}
              className="absolute right-3 bottom-3 text-gray-400 hover:text-yellow-400 active:text-yellow-500 transition-colors touch-manipulation p-1"
            >
              <EmojiIcon className="w-5 h-5" />
            </button>

            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div 
                ref={emojiPickerRef}
                className="fixed md:absolute bottom-20 md:bottom-full left-2 right-2 md:left-auto md:right-0 mb-0 md:mb-2 z-50 shadow-2xl rounded-lg overflow-hidden"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.DARK}
                  width={isMobile ? Math.min(window.innerWidth - 16, 350) : 320}
                  height={isMobile ? 350 : 400}
                  searchPlaceHolder="Search emoji..."
                  previewConfig={{ showPreview: false }}
                  emojiStyle={EmojiStyle.NATIVE}
                />
              </div>
            )}
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors touch-manipulation"
            >
              <SendIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="ml-2">You are typing...</span>
            </span>
          </div>
        )}

        {/* Quick Actions - Hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2 mt-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition-colors">
            <AtIcon className="w-4 h-4" />
            <span>Mention</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition-colors">
            <HashIcon className="w-4 h-4" />
            <span>Channel</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition-colors">
            <CodeIcon className="w-4 h-4" />
            <span>Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Icons
function PaperclipIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49" />
    </svg>
  );
}

function EmojiIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function AtIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  );
}

function HashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  );
}
