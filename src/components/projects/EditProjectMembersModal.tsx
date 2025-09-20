"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { projectService, type ProjectResponse } from "@/services/projectService";
import { dashboardService, type TeamMember } from "@/services/dashboardService";

interface EditProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectResponse | null;
  onMembersUpdated?: (project: ProjectResponse) => void;
}

export default function EditProjectMembersModal({ 
  isOpen, 
  onClose, 
  project, 
  onMembersUpdated 
}: EditProjectMembersModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(false);

  // Handle ESC key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Fetch team members when modal opens
  useEffect(() => {
    if (isOpen && project) {
      fetchTeamMembers();
    }
  }, [isOpen, project]);

  const fetchTeamMembers = async () => {
    try {
      setFetchingMembers(true);
     
      
      const members = await dashboardService.getTeamMembers();
     
      
      setTeamMembers(members);
      
      // Initialize with current project members
      if (project && project.members) {
        const currentMemberIds = project.members.map(member => member.id).filter(Boolean);
        
        setSelectedMemberIds(currentMemberIds);
      }
    } catch (error) {
      console.error("EditProjectMembersModal: Failed to fetch team members:", error);
      toastError("Failed to load team members");
    } finally {
      setFetchingMembers(false);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = async () => {
    if (!project) return;

    try {
      setLoading(true);

      // Find members to add (selected but not currently in project)
      const currentMemberIds = project.members?.map(member => member.id).filter(Boolean) || [];
      const membersToAdd = selectedMemberIds.filter(id => !currentMemberIds.includes(id));
      
      // Find members to remove (currently in project but not selected)
      const membersToRemove = currentMemberIds.filter(id => !selectedMemberIds.includes(id));

      
      // Add new members
      if (membersToAdd.length > 0) {
        await projectService.addProjectMembers(project.id, { memberIds: membersToAdd });
      }

      // Remove members (if you want to implement removal)
      // Note: You might need to add a remove members endpoint
      for (const memberId of membersToRemove) {
        try {
          await projectService.removeProjectMember(project.id, memberId);
        } catch (error) {
          console.error(`Failed to remove member ${memberId}:`, error);
        }
      }

      // Fetch updated project data
      const updatedProject = await projectService.getProject(project.id);
      
      toastSuccess("Project members updated successfully!");
      
      if (onMembersUpdated) {
        onMembersUpdated(updatedProject);
      }
      
      onClose();
    } catch (error: unknown) {
      console.error("EditProjectMembersModal: Error updating project members:", error);
      let errorMessage = "Failed to update project members";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original members
    if (project && project.members) {
      const currentMemberIds = project.members.map(member => member.id).filter(Boolean);
      setSelectedMemberIds(currentMemberIds);
    }
    onClose();
  };

  if (!isOpen || !project) return null;

  // Ensure teamMembers is an array before filtering
  const safeTeamMembers = Array.isArray(teamMembers) ? teamMembers : [];
  
  // Get members not currently in project for "Available to Add" section
  const currentMemberIds = project.members?.map(member => member.id).filter(Boolean) || [];
  const availableMembers = safeTeamMembers.filter(member => {
    const memberId = member.id || member._id;
    return memberId && !currentMemberIds.includes(memberId);
  });
  const currentMembers = safeTeamMembers.filter(member => {
    const memberId = member.id || member._id;
    return memberId && currentMemberIds.includes(memberId);
  });

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
            <h2 className="text-xl font-semibold text-white">
              Edit Project Members - {project.name}
            </h2>
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
            {fetchingMembers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-300">Loading team members...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Current Members */}
                {currentMembers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Current Members</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {currentMembers.map((member) => {
                        const memberId = member.id || member._id;
                        if (!memberId) return null;
                        
                        return (
                          <label
                            key={memberId}
                            className="flex items-center space-x-2 p-3 bg-blue-900/20 border border-blue-600 rounded-md cursor-pointer hover:bg-blue-800/30 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMemberIds.includes(memberId)}
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
                  </div>
                )}

                {/* Available Members */}
                {availableMembers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Available to Add</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableMembers.map((member) => {
                        const memberId = member.id || member._id;
                        if (!memberId) return null;
                        
                        return (
                          <label
                            key={memberId}
                            className="flex items-center space-x-2 p-3 bg-gray-900 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-800 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMemberIds.includes(memberId)}
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
                  </div>
                )}

                {/* No available members */}
                {availableMembers.length === 0 && currentMembers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No team members available</p>
                  </div>
                )}

                {/* Selected Members Summary */}
                {selectedMemberIds.length > 0 && (
                  <div className="p-4 bg-gray-900 border border-gray-600 rounded-md">
                    <p className="text-sm text-gray-300 mb-2">
                      Selected members ({selectedMemberIds.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMemberIds.map((memberId) => {
                        const member = safeTeamMembers.find(m => m.id === memberId);
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
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={loading || fetchingMembers}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
