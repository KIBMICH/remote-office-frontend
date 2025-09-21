import React from "react";
import Button from "@/components/ui/Button";

interface QuickActionsProps {
  onCreateTask?: () => void;
}

export default function QuickActions({ onCreateTask }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Button 
        className="justify-center gap-3 bg-blue-600 hover:bg-blue-700"
        onClick={onCreateTask}
      >
        <PlusIcon className="w-5 h-5" />
        Create New Task
      </Button>
      <Button className="justify-center gap-3 bg-emerald-600 hover:bg-emerald-700">
        <PlayIcon className="w-5 h-5" />
        Start New Meeting
      </Button>
      <Button variant="secondary" className="justify-center gap-3 bg-gray-800 text-white hover:bg-gray-700">
        <UsersIcon className="w-5 h-5 text-white" />
        Invite Team Members
      </Button>
    </div>
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
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="9" cy="9" r="4" />
      <path d="M17 21a6 6 0 0 0-12 0" />
      <circle cx="17" cy="7" r="3" />
    </svg>
  );
}
