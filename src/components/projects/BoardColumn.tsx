import React from "react";
import Card from "@/components/ui/Card";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "@/types/project";

type Props = {
  title: string;
  status: TaskStatus;
  tasks: ReadonlyArray<Task>;
};

export default function BoardColumn({ title, status, tasks }: Props) {
  return (
    <div className="min-w-[320px] w-full space-y-4">
      <Card className="bg-gray-900/70 border-gray-800">
        <header className="flex items-center justify-between">
          <h3 className="text-gray-200 font-semibold text-sm">{title}</h3>
          <span className="text-xs text-gray-400">{tasks.length}</span>
        </header>
        <div className="mt-4 space-y-4">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
          {tasks.length === 0 && (
            <div className="text-sm text-gray-500">No tasks</div>
          )}
        </div>
      </Card>
    </div>
  );
}
