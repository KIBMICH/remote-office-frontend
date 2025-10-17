"use client";
import React, { useMemo, useRef, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Message = {
  id: string;
  author: string;
  time: string;
  text: string;
  avatar?: string;
};

type ChatPanelProps = {
  initialMessages?: Message[];
  onSend?: (message: string) => void;
};

export default function ChatPanel({ initialMessages = [], onSend }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: crypto.randomUUID(),
      author: "You",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: trimmed,
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    onSend?.(trimmed);
    queueMicrotask(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));
  };

  const header = useMemo(() => (
    <div className="px-4 py-3 border-b border-gray-800">
      <h3 className="text-sm font-semibold text-gray-200">Meeting Chat</h3>
    </div>
  ), []);

  return (
    <aside className="flex h-full w-full flex-col rounded-xl border border-gray-800 bg-gray-900/60">
      {header}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="flex items-start gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gray-800 text-xs grid place-items-center text-gray-300">{m.author[0]}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-medium text-gray-200">{m.author}</span>
                <span>{m.time}</span>
              </div>
              <p className="text-sm text-gray-200 break-words">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="bg-gray-950/60 border-gray-800 text-gray-200 placeholder-gray-500"
            variant="dark"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} aria-label="Send message" className="!min-h-[40px] px-3 bg-blue-600 hover:bg-blue-700">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M2 21l20-9L2 3v7l14 2-14 2v7Z"/></svg>
          </Button>
        </div>
      </div>
    </aside>
  );
}


