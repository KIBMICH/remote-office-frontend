"use client";

import React from 'react';
import ChatLayout from '@/components/chat/ChatLayout';

export default function ChatPage() {
  return (
    <div className="fixed inset-0 top-16 left-0 md:left-64 right-0 bottom-0">
      <ChatLayout />
    </div>
  );
}
