"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import BoardColumn from "@/components/projects/BoardColumn";
import AddTaskModal from "@/components/projects/AddTaskModal";
import type { Task } from "@/types/project";
import { taskService, type TaskResponse, type TaskFilters } from "@/services/taskService";
import { dashboardService } from "@/services/dashboardService";


export default function ProjectsPage() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
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

  // Fetch team members and projects for task creation
  const fetchSupportingData = async () => {
    try {
      const membersData = await dashboardService.getTeamMembers();
      setTeamMembers(membersData);
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

  // Convert TaskResponse to Task format for BoardColumn component
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

  const todo = tasks.filter((t) => t.status === "todo").map(convertToTask);
  const inProgress = tasks.filter((t) => t.status === "in_progress").map(convertToTask);
  const done = tasks.filter((t) => t.status === "done").map(convertToTask);

  const handleTaskCreated = (newTask: TaskResponse) => {
    setTasks(prev => [newTask, ...prev]);
    setIsModalOpen(false);
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: "todo" | "in_progress" | "done") => {
    try {
      await taskService.updateTaskStatus(taskId, { status: newStatus });
      
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError("Failed to update task status. Please try again.");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">Project Tasks</h1>
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
        <Link href="/projects/project-list" className="flex-shrink-0">
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-1 sm:gap-2 flex-shrink-0 min-w-0" 
              size="sm"
              title="Project List"
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
              </svg>
              <span className="hidden sm:inline whitespace-nowrap">Project List</span>
            </Button>
          </Link>
        <Link href="/projects/task-list" className="flex-shrink-0">
            <Button 
              variant="outline" 
              className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-1 sm:gap-2 flex-shrink-0 min-w-0" 
              size="sm"
              title="Task List"
            >
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98" />
              </svg>
              <span className="hidden sm:inline whitespace-nowrap">Task List</span>
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-1 sm:gap-2 flex-shrink-0 min-w-0" 
            size="sm"
            title="All Tasks"
          >
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 6h14" />
              <path d="M3 12h10" />
              <path d="M3 18h6" />
            </svg>
            <span className="hidden sm:inline whitespace-nowrap">All Tasks</span>
          </Button>
          <Button 
            variant="outline" 
            className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-1 sm:gap-2 flex-shrink-0 min-w-0" 
            size="sm"
            title="My Tasks"
          >
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <circle cx="12" cy="8" r="3" />
              <path d="M6 20a6 6 0 0 1 12 0" />
            </svg>
            <span className="hidden sm:inline whitespace-nowrap">My Tasks</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="text-gray-300 border-gray-700 hover:bg-gray-800 gap-1 sm:gap-2 flex-shrink-0 min-w-0" 
            size="sm"
            title="Sort By"
          >
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 6h18" />
              <path d="M7 12h14" />
              <path d="M11 18h10" />
            </svg>
            <span className="hidden sm:inline whitespace-nowrap">Sort By</span>
          </Button>
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 sm:gap-2 flex-shrink-0 min-w-0" 
            size="sm"
            title="New Task"
          >
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="hidden sm:inline whitespace-nowrap">New Task</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 rounded-lg border border-gray-800 p-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-20 bg-gray-800 rounded"></div>
                  <div className="h-20 bg-gray-800 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BoardColumn title="To Do" status="todo" tasks={todo} />
          <BoardColumn title="In Progress" status="in_progress" tasks={inProgress} />
          <BoardColumn title="Done" status="done" tasks={done} />
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
