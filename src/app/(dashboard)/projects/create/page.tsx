"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useToast } from "@/components/ui/ToastProvider";
import type { Priority, TaskStatus } from "@/types/project";

export default function CreateTaskPage() {
  const router = useRouter();
  const { success: toastSuccess } = useToast();
  
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
      // TODO: Implement actual API call to create task
      console.log("Creating task:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toastSuccess("Task created successfully!");
      router.push("/projects");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/projects");
  };

  return (
    <div className="w-full max-w-5xl mx-auto lg:ml-8 lg:mr-auto space-y-4 sm:space-y-6 px-3 sm:px-6 lg:px-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Create New Task</h1>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Task Details Section */}
          <div>
            <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Task Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Assignment & Scheduling Section */}
          <div>
            <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Assignment & Scheduling</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assignee
                </label>
                <select
                  value={formData.assignee}
                  onChange={(e) => handleInputChange("assignee", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select team member</option>
                  <option value="Alice Chen">Alice Chen</option>
                  <option value="Bob Johnson">Bob Johnson</option>
                  <option value="Charlie Davis">Charlie Davis</option>
                  <option value="David Lee">David Lee</option>
                  <option value="Eva Green">Eva Green</option>
                  <option value="Frank Moore">Frank Moore</option>
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
            <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Categorization & Status</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project
                </label>
                <select
                  value={formData.project}
                  onChange={(e) => handleInputChange("project", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Associate with a project</option>
                  <option value="remote-office-platform">Remote Office Platform</option>
                  <option value="user-authentication">User Authentication System</option>
                  <option value="project-management">Project Management Module</option>
                  <option value="team-collaboration">Team Collaboration Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  placeholder="Add tags (press Enter to add)"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-700">
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
      </Card>
    </div>
  );
}
