export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";
export type ProjectStatus = "active" | "completed" | "on_hold" | "cancelled";

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
  project?: {
    id: string;
    name: string;
  };
  tags?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  dueDate: string; // ISO date
  progress: number; // 0-100
  members: {
    id: string;
    name: string;
    avatarUrl?: string;
  }[];
  taskCount: number;
  completedTasks: number;
  createdAt: string;
  tags?: string[];
}
