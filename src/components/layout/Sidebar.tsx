"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navigation = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Teams", href: "/teams", icon: UsersIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Chat", href: "/chat", icon: ChatIcon },
  { name: "Meetings", href: "/meetings", icon: CalendarIcon },
  { name: "Files", href: "/files", icon: FilesIcon },
  { name: "Settings", href: "/settings", icon: SettingsIcon },
];

type SidebarProps = { showHeader?: boolean };

export default function Sidebar({ showHeader = true }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-black border-r border-gray-800">
      {showHeader && (
        <div className="flex h-16 items-center px-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-xs font-bold">RH</div>
            <span className="font-semibold text-white">RemoteHub</span>
          </div>
        </div>
      )}
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-300"
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 space-y-3 border-t border-gray-800">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">
          <PlusIcon className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-sky-600/80 hover:bg-sky-600 text-white px-3 py-2 rounded-lg text-sm">
          <PlayIcon className="w-4 h-4" />
          <span>Start Meeting</span>
        </button>
        <div className="flex items-center space-x-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-gray-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">User Name</p>
            <p className="text-xs text-gray-400 truncate">user@example.com</p>
          </div>
          <button className="text-gray-400 hover:text-white" aria-label="Notifications">
            <BellIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" />
    </svg>
  );
}
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M15 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M2 21a7 7 0 0 1 14 0" />
      <path d="M22 21a5 5 0 0 0-6-4" />
    </svg>
  );
}
function FolderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 6h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />
    </svg>
  );
}
function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.5-5A8 8 0 1 1 21 12Z" />
    </svg>
  );
}
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}
function FilesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6l-.09.11a2 2 0 0 1-3.22 0l-.09-.11a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1l-.11-.09a2 2 0 0 1 0-3.22l.11-.09a1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6c.33 0 .67-.12 1-.6l.09-.11a2 2 0 0 1 3.22 0l.09.11c.33.48.67.6 1 .6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.48.33-.6.67-.6 1 0 .33.12.67.6 1Z" />
    </svg>
  );
}
function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
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
function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7-11-7Z" />
    </svg>
  );
}
