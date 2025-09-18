"use client";
import React from "react";
import Button from "@/components/ui/Button";
import BoardColumn from "@/components/projects/BoardColumn";
import type { Task } from "@/types/project";

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Design new user onboarding flow",
    description:
      "Create wireframes and mockups for the new user onboarding experience, focusing on clarity and ease of use.",
    assignee: { name: "Alice Chen" },
    dueDate: "2024-09-15",
    priority: "high",
    status: "todo",
  },
  {
    id: "2",
    title: "Research competitor features",
    description:
      "Analyze key features of leading competitor platforms to identify gaps and opportunities.",
    assignee: { name: "Bob Johnson" },
    dueDate: "2024-09-10",
    priority: "medium",
    status: "todo",
  },
  {
    id: "3",
    title: "Refactor notification service",
    description:
      "Improve the existing notification service for better scalability, reliability, and real-time delivery.",
    assignee: { name: "Charlie Davis" },
    dueDate: "2024-09-22",
    priority: "high",
    status: "todo",
  },
  {
    id: "4",
    title: "Develop API endpoints for authentication",
    description:
      "Implement secure RESTful APIs for user registration, login, token generation, and refresh.",
    assignee: { name: "David Lee" },
    dueDate: "2024-09-20",
    priority: "high",
    status: "in_progress",
  },
  {
    id: "5",
    title: "Implement frontend login component",
    description:
      "Build the React component for user login, ensuring responsive design and integration with new auth APIs.",
    assignee: { name: "Eva Green" },
    dueDate: "2024-09-18",
    priority: "medium",
    status: "in_progress",
  },
  {
    id: "6",
    title: "Configure CI/CD pipeline",
    description:
      "Set up automated build, test, and deployment pipelines using GitHub Actions for continuous integration.",
    assignee: { name: "Frank Moore" },
    dueDate: "2024-09-25",
    priority: "low",
    status: "in_progress",
  },
  {
    id: "7",
    title: "Setup project repository",
    description:
      "Initialize the Git repository, configure branching strategy, and establish basic project structure.",
    assignee: { name: "Grace Hall" },
    dueDate: "2024-08-30",
    priority: "low",
    status: "done",
  },
  {
    id: "8",
    title: "Define initial data models",
    description:
      "Design database schemas for users, tasks, projects, and teams, including relationships and constraints.",
    assignee: { name: "Henry King" },
    dueDate: "2024-08-28",
    priority: "medium",
    status: "done",
  },
  {
    id: "9",
    title: "Create project documentation",
    description:
      "Write initial project documentation covering setup instructions, architecture overview, and code module descriptions.",
    assignee: { name: "Ivy Chen" },
    dueDate: "2024-08-25",
    priority: "low",
    status: "done",
  },
];

export default function ProjectsPage() {
  const todo = MOCK_TASKS.filter((t) => t.status === "todo");
  const inProgress = MOCK_TASKS.filter((t) => t.status === "in_progress");
  const done = MOCK_TASKS.filter((t) => t.status === "done");

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">Project Tasks</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-2" size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 6h14" />
              <path d="M3 12h10" />
              <path d="M3 18h6" />
            </svg>
            <span>All Tasks</span>
          </Button>
          <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-2" size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="8" r="3" />
              <path d="M6 20a6 6 0 0 1 12 0" />
            </svg>
            <span>My Tasks</span>
          </Button>
          <Button variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-2" size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 6h18" />
              <path d="M7 12h14" />
              <path d="M11 18h10" />
            </svg>
            <span>Sort By</span>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">+ Add Task</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BoardColumn title="To Do" status="todo" tasks={todo} />
        <BoardColumn title="In Progress" status="in_progress" tasks={inProgress} />
        <BoardColumn title="Done" status="done" tasks={done} />
      </div>
    </section>
  );
}
