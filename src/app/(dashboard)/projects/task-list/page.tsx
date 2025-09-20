"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AddTaskModal from "@/components/projects/AddTaskModal";
import type { Task } from "@/types/project";
import { taskService, type TaskResponse, type TaskFilters } from "@/services/taskService";
import { dashboardService } from "@/services/dashboardService";
import { projectService, type ProjectResponse } from "@/services/projectService";


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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original if formatting fails
  }
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: 50,
    sortBy: "dueDate",
    sortOrder: "asc"
  });

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks(filters);
      setTasks(response.tasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch supporting data
  const fetchSupportingData = async () => {
    try {
      console.log("TaskListPage: Fetching supporting data...");
      
      // Fetch team members
      const membersData = await dashboardService.getTeamMembers();
      console.log("TaskListPage: Team members fetched:", membersData.length);
      setTeamMembers(membersData);
      
      // Fetch active projects for task assignment
      const projectsResponse = await projectService.getProjects({
        status: "active",
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
      });
      console.log("TaskListPage: Projects fetched:", projectsResponse.projects.length);
      setProjects(projectsResponse.projects);
      
    } catch (err) {
      console.error("Failed to fetch supporting data:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchSupportingData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Convert TaskResponse to Task for UI compatibility
  const convertToTask = (taskResponse: TaskResponse): Task => ({
    id: taskResponse.id,
    title: taskResponse.title,
    description: taskResponse.description,
    assignee: taskResponse.assignee ? {
      name: taskResponse.assignee.name,
      avatarUrl: taskResponse.assignee.avatarUrl
    } : { name: "Unassigned" },
    dueDate: taskResponse.dueDate,
    priority: taskResponse.priority,
    status: taskResponse.status,
    project: taskResponse.project,
    tags: taskResponse.tags
  });

  const convertedTasks = tasks.map(convertToTask);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await taskService.updateTaskStatus(taskId, { 
        status: newStatus as TaskResponse['status'] 
      });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus as TaskResponse['status'] } : task
      ));
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError("Failed to update task status. Please try again.");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleTaskCreated = (newTask: TaskResponse) => {
    setTasks(prev => [newTask, ...prev]);
    setIsModalOpen(false);
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-300">Loading tasks...</span>
          </div>
        </div>
      ) : (
        /* Table */
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
              {convertedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div>
                      <div className="font-medium text-white text-sm sm:text-base">{task.title}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{task.description}</div>
                      <div className="sm:hidden mt-2 space-y-1">
                        <div className="text-xs text-gray-400">Assignee: <span className="text-gray-300">{task.assignee.name}</span></div>
                        <div className="text-xs text-gray-400">Due: <span className="text-gray-300">{formatDate(task.dueDate)}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-sm hidden sm:table-cell">{task.assignee.name}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-sm hidden md:table-cell">{formatDate(task.dueDate)}</td>
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
      )}

      {/* Empty state if no tasks */}
      {!loading && convertedTasks.length === 0 && (
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
        teamMembers={teamMembers}
        projects={projects}
      />
    </section>
  );
}
