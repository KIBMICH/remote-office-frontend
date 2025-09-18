"use client";
import React from "react";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import type { Task } from "@/types/project";

function priorityColor(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "bg-rose-600/20 text-rose-300 border-rose-600/40";
    case "medium":
      return "bg-emerald-600/20 text-emerald-300 border-emerald-600/40";
    case "low":
    default:
      return "bg-gray-600/20 text-gray-300 border-gray-600/40";
  }
}

type Props = { task: Task };

export default function TaskCard({ task }: Props) {
  const due = new Date(task.dueDate);
  const dueStr = due.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });

  return (
    <Card className="bg-gray-900/80 border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-gray-100 leading-tight">{task.title}</h4>
          <p className="mt-1 text-sm text-gray-400 line-clamp-3">{task.description}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${priorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Avatar size="sm" src={task.assignee.avatarUrl} fallback={task.assignee.name[0]} />
          <span className="text-gray-300">{task.assignee.name}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 11h18" />
          </svg>
          <span>{dueStr}</span>
        </div>
      </div>
    </Card>
  );
}
