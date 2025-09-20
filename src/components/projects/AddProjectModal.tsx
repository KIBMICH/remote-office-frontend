"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import type { Priority, ProjectStatus } from "@/types/project";
import { projectService, type ProjectResponse } from "@/services/projectService";
import { type TeamMember } from "@/services/dashboardService";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: ProjectResponse) => void;
  teamMembers?: TeamMember[];
}

export default function AddProjectModal({ isOpen, onClose, onProjectCreated, teamMembers = [] }: AddProjectModalProps) {
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
    name: "",
    description: "",
    dueDate: "",
    memberIds: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter(id => id !== memberId)
        : [...prev.memberIds, memberId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      toastError("Project name is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toastError("Project description is required");
      return;
    }
    
    if (!formData.dueDate) {
      toastError("Due date is required");
      return;
    }
    
    setLoading(true);
    
    try {
      
      // Format the date to match API spec: "2024-12-31T23:59:59Z"
      const dateObj = new Date(formData.dueDate + "T23:59:59Z");
      const isoDateWithTime = dateObj.toISOString();
      
      
      // Create payload matching the API specification exactly
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        dueDate: isoDateWithTime,
        memberIds: teamMembers.length > 0 ? formData.memberIds : []
      };
      
      
      
    
      
      // Create project using API with correct format
      
      const newProject = await projectService.createProject(payload);
      
   
      toastSuccess("Project created successfully!");
      
      // Call the callback if provided
      if (onProjectCreated) {
        onProjectCreated(newProject);
      }
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        dueDate: "",
        memberIds: []
      });
      
      onClose();
    } catch (error: any) {
      console.error("Error creating project:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      let errorMessage = "Failed to create project. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      description: "",
      dueDate: "",
      memberIds: []
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


              {/* Team Members Section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Team Members</h3>
                
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-4 p-2 bg-yellow-900/20 border border-yellow-600 rounded text-yellow-300 text-xs">
                  Team members count: {teamMembers.length}
                  </div>
                )}
                
                {teamMembers.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {teamMembers.map((member) => {
                        const memberId = member.id || member._id;
                        if (!memberId) return null; // Skip members without valid ID
                        
                        return (
                          <label
                            key={memberId}
                            className="flex items-center space-x-2 p-3 bg-gray-900 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.memberIds.includes(memberId)}
                              onChange={() => handleMemberToggle(memberId)}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-300 block truncate">{member.name}</span>
                              <span className="text-xs text-gray-400 block truncate">{member.email}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    
                    {formData.memberIds.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-900 border border-gray-600 rounded-md">
                        <p className="text-sm text-gray-300 mb-2">Selected members ({formData.memberIds.length}):</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.memberIds.map((memberId) => {
                            const member = teamMembers.find(m => (m.id || m._id) === memberId);
                            return member ? (
                              <span
                                key={memberId}
                                className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full"
                              >
                                {member.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-gray-900 border border-gray-600 rounded-md">
                    <p className="text-gray-400 text-sm">
                      No team members available. You can create the project without assigning members and add them later.
                    </p>
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
