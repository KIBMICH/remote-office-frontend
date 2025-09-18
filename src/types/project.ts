export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    avatarUrl?: string;
  };
  dueDate: string; // ISO date
  priority: Priority;
  status: TaskStatus;
}
