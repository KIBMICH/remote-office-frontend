"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AddTaskModal from "@/components/projects/AddTaskModal";
import type { Task } from "@/types/project";

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Design homepage",
    description: "Create the main homepage design with modern UI elements",
    assignee: { name: "John Smith" },
    dueDate: "2024-05-01",
    priority: "medium",
    status: "todo",
  },
  {
    id: "2",
    title: "Implement user authentication module",
    description: "Build secure user authentication with JWT tokens",
    assignee: { name: "Alice Johnson" },
    dueDate: "2024-04-30",
    priority: "high",
    status: "in_progress",
  },
  {
    id: "3",
    title: "Test responsive design",
    description: "Ensure the application works across all device sizes",
    assignee: { name: "Bob Brown" },
    dueDate: "2024-04-25",
    priority: "low",
    status: "todo",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "todo":
      return "bg-gray-600 text-gray-200";
    case "in_progress":
      return "bg-blue-600 text-blue-100";
    case "done":
      return "bg-green-600 text-green-100";
    default:
      return "bg-gray-600 text-gray-200";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "todo":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus as Task['status'] } : task
    ));
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <section className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">Task List</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 sm:px-4 sm:py-2"
            size="sm"
          >
            <span className="text-lg leading-none sm:hidden">+</span>
            <span className="hidden sm:inline">New Task</span>
          </Button>
        </div>
      </header>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Task</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell">Assignee</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden md:table-cell">Due Date</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Priority</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Status</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div>
                      <div className="font-medium text-white text-sm sm:text-base">{task.title}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</div>
                      <div className="sm:hidden mt-2 space-y-1">
                        <div className="text-xs text-gray-400">Assignee: <span className="text-gray-300">{task.assignee.name}</span></div>
                        <div className="text-xs text-gray-400">Due: <span className="text-gray-300">{task.dueDate}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-sm hidden sm:table-cell">{task.assignee.name}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-sm hidden md:table-cell">{task.dueDate}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <span className={`capitalize text-xs sm:text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {formatStatus(task.status)}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs px-2 py-1"
                      >
                        <span className="sm:hidden">✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-1 sm:px-2 py-1 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white text-xs px-2 py-1"
                        onClick={() => handleDelete(task.id)}
                      >
                        <span className="sm:hidden">🗑️</span>
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty state if no tasks */}
      {tasks.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M9 12l2 2 4-4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No tasks found</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4 max-w-md mx-auto">Get started by creating your first task.</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            Create Task
          </Button>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </section>
  );
}
