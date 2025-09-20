"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import type { Priority, TaskStatus } from "@/types/project";
import { taskService, type TaskResponse } from "@/services/taskService";
import { type TeamMember } from "@/services/dashboardService";
import { type ProjectResponse } from "@/services/projectService";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: (task: TaskResponse) => void;
  teamMembers?: TeamMember[];
  projects?: ProjectResponse[];
}

export default function AddTaskModal({ isOpen, onClose, onTaskCreated, teamMembers = [], projects = [] }: AddTaskModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();

  // Handle ESC key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium" as Priority,
    status: "todo" as TaskStatus,
    project: "",
    tags: ""
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format the date to match API spec: "2024-12-31T23:59:59Z"
      const dateObj = new Date(formData.dueDate + "T23:59:59Z");
      const isoDateWithTime = dateObj.toISOString();
      
      console.log("AddTaskModal: Original date:", formData.dueDate);
      console.log("AddTaskModal: ISO formatted date:", isoDateWithTime);
      
      // Create task using API
      const payload = {
        title: formData.title,
        description: formData.description,
        assigneeId: formData.assignee || undefined,
        dueDate: isoDateWithTime,
        priority: formData.priority,
        status: formData.status,
        projectId: formData.project || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      console.log("AddTaskModal: Creating task with payload:", payload);
      
      const newTask = await taskService.createTask(payload);
      
      toastSuccess("Task created successfully!");
      
      // Call the callback if provided
      if (onTaskCreated) {
        onTaskCreated(newTask);
      }
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
        project: "",
        tags: ""
      });
      
      onClose();
    } catch (error: unknown) {
      console.error("AddTaskModal: Error creating task:", error);
      
      let errorMessage = "Failed to create task. Please try again.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string; error?: string }; status?: number } };
        console.error("AddTaskModal: Error response:", axiosError.response?.data);
        console.error("AddTaskModal: Error status:", axiosError.response?.status);
        
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        }
      }
      
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      priority: "medium",
      status: "todo",
      project: "",
      tags: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Details Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Task Details</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Task Title
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Implement user authentication module"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Provide a detailed description of the task, including objectives and requirements."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Assignment & Scheduling Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Assignment & Scheduling</h3>
                
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-2 bg-yellow-900/20 border border-yellow-600 rounded text-yellow-300 text-xs">
                    Debug: Team members: {teamMembers.length}, Projects: {projects.length}
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assignee
                    </label>
                    <select
                      value={formData.assignee}
                      onChange={(e) => handleInputChange("assignee", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select team member (optional)</option>
                      {teamMembers.length > 0 ? (
                        teamMembers.map((member) => {
                          const memberId = member.id || member._id;
                          if (!memberId) return null;
                          
                          return (
                            <option key={memberId} value={memberId}>
                              {member.name} ({member.email})
                            </option>
                          );
                        })
                      ) : (
                        <option value="" disabled>No team members available</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      className="bg-gray-900 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Categorization & Status Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Categorization & Status</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project
                    </label>
                    <select
                      value={formData.project}
                      onChange={(e) => handleInputChange("project", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Associate with a project (optional)</option>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No projects available</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tags
                    </label>
                    <Input
                      type="text"
                      placeholder="Add tags (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? "Creating..." : "Create Task"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
