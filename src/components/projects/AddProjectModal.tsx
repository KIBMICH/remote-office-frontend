"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import type { Priority, ProjectStatus } from "@/types/project";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    priority: Priority;
    dueDate: string;
    progress: number;
    members: { id: string; name: string; avatarUrl?: string; }[];
    taskCount: number;
    completedTasks: number;
    createdAt: string;
    tags?: string[];
  }) => void;
}

export default function AddProjectModal({ isOpen, onClose, onProjectCreated }: AddProjectModalProps) {
  const { success: toastSuccess } = useToast();

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
    name: "",
    description: "",
    priority: "medium" as Priority,
    status: "active" as ProjectStatus,
    dueDate: "",
    members: [] as string[],
    tags: ""
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberToggle = (memberName: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(memberName)
        ? prev.members.filter(m => m !== memberName)
        : [...prev.members, memberName]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement actual API call to create project
      console.log("Creating project:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create project object to pass back
      const newProject = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        progress: 0,
        members: formData.members.map((name, index) => ({
          id: `member_${index + 1}`,
          name,
          avatarUrl: ""
        })),
        taskCount: 0,
        completedTasks: 0,
        createdAt: new Date().toISOString().split('T')[0],
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };
      
      toastSuccess("Project created successfully!");
      
      // Call the callback if provided
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        priority: "medium",
        status: "active",
        dueDate: "",
        members: [],
        tags: ""
      });
      
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      description: "",
      priority: "medium",
      status: "active",
      dueDate: "",
      members: [],
      tags: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  const availableMembers = [
    "Alice Chen",
    "Bob Johnson", 
    "Charlie Davis",
    "David Lee",
    "Eva Green",
    "Frank Moore",
    "Grace Hall",
    "Henry King",
    "Ivy Chen",
    "Jack Wilson"
  ];

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
            <h2 className="text-xl font-semibold text-white">Create New Project</h2>
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
              {/* Project Details Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Project Details</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Remote Office Platform"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="lg:col-span-1">
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

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Provide a detailed description of the project, including objectives and scope."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Project Settings Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Project Settings</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
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

              {/* Team Members Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Team Members</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {availableMembers.map((member) => (
                    <label
                      key={member}
                      className="flex items-center space-x-2 p-3 bg-gray-900 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.members.includes(member)}
                        onChange={() => handleMemberToggle(member)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-300">{member}</span>
                    </label>
                  ))}
                </div>
                
                {formData.members.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-900 border border-gray-600 rounded-md">
                    <p className="text-sm text-gray-300 mb-2">Selected members ({formData.members.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.members.map((member) => (
                        <span
                          key={member}
                          className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                  {loading ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
