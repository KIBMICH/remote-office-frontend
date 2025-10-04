"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastProvider';
import { chatService } from '@/services/chatService';
import { useChatContext } from '@/context/ChatContext';
import { UserResponse, CreateChannelPayload } from '@/types/chat';
import { projectService } from '@/services/projectService';

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChannelType = 'direct' | 'group' | 'project';

export default function AddChannelModal({ isOpen, onClose }: AddChannelModalProps) {
  const { success: toastSuccess, error: toastError } = useToast();
  const { refreshChannels } = useChatContext();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'group' as ChannelType,
    isPrivate: false,
    selectedMembers: [] as string[],
    projectId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]); // Keep track of selected users

  // Fetch projects when modal opens
  useEffect(() => {
    const fetchProjects = async () => {
      if (isOpen && formData.type === 'project') {
        try {
          const response = await projectService.getProjects({ status: 'active' });
          setProjects(response.projects.map(p => ({ id: p.id, name: p.name })));
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };
    fetchProjects();
  }, [isOpen, formData.type]);

  // Handle ESC key press and body scroll
  useEffect(() => {
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

  // Search users for adding to channel
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        console.log('Searching users with query:', searchQuery);
        const users = await chatService.searchUsers(searchQuery);
        console.log('Search results:', users);
        
        // Convert UserResponse to include default status
        const usersWithStatus = users.map(u => ({
          ...u,
          status: u.status || 'offline' as const
        }));
        setSearchResults(usersWithStatus);
      } catch (error: any) {
        console.error('Error searching users:', error);
        console.error('Error details:', error?.response?.data || error?.message);
        
        // Show error toast for rate limit or other errors
        if (error?.response?.status === 429) {
          toastError('Rate limit exceeded. Please wait before searching again.');
        }
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, toastError]);

  const handleInputChange = (field: string, value: string | boolean | ChannelType) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberToggle = (userId: string, user?: UserResponse) => {
    const isRemoving = formData.selectedMembers.includes(userId);
    
    setFormData(prev => ({
      ...prev,
      selectedMembers: isRemoving
        ? prev.selectedMembers.filter(id => id !== userId)
        : [...prev.selectedMembers, userId]
    }));
    
    // Update selected users list
    if (isRemoving) {
      setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    } else if (user) {
      setSelectedUsers(prev => [...prev, user]);
    }
    
    // Clear search input after selection
    setSearchQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.type !== 'direct' && !formData.name.trim()) {
      toastError('Channel name is required');
      return;
    }

    if (formData.type === 'direct' && formData.selectedMembers.length !== 1) {
      toastError('Direct channels require exactly one other participant');
      return;
    }

    if (formData.type === 'project' && !formData.projectId) {
      toastError('Please select a project');
      return;
    }

    setLoading(true);
    
    try {
      // For direct channels, use a generic name or the other user's name
      let channelName = formData.name.trim();
      if (formData.type === 'direct') {
        const otherUser = searchResults.find(u => u.id === formData.selectedMembers[0]);
        channelName = otherUser ? `DM with ${otherUser.name}` : 'Direct Message';
      }

      const payload: CreateChannelPayload = {
        name: channelName,
        type: formData.type,
        participantIds: formData.selectedMembers,
        isPrivate: formData.isPrivate,
      };

      if (formData.type === 'project' && formData.projectId) {
        payload.projectId = formData.projectId;
      }

      console.log('Creating channel with payload:', payload);
      const newChannel = await chatService.createChannel(payload);
      console.log('Channel created successfully:', newChannel);
      
      toastSuccess('Channel created successfully!');
      
      // Refresh channels list
      if (refreshChannels) {
        await refreshChannels();
      }
      
      handleCancel();
    } catch (error: any) {
      console.error('Error creating channel:', error);
      console.error('Error details:', error?.response?.data || error?.message);
      
      // Show specific error message
      if (error?.response?.status === 429) {
        toastError('Rate limit exceeded. Please wait a few minutes and try again.');
      } else if (error?.response?.status === 403) {
        toastError('You do not have permission to create this type of channel.');
      } else if (error?.response?.data?.message) {
        toastError(error.response.data.message);
      } else {
        toastError('Failed to create channel. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      type: 'group',
      isPrivate: false,
      selectedMembers: [],
      projectId: ''
    });
    setSearchQuery('');
    setSearchResults([]);
    setSelectedUsers([]); // Clear selected users
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
          className="relative bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Create New Channel</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Channel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Channel Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ChannelType)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="group">Group Channel</option>
                  <option value="direct">Direct Message</option>
                  <option value="project">Project Channel</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  {formData.type === 'direct' && 'One-on-one conversation with another user'}
                  {formData.type === 'group' && 'Team chat for multiple members'}
                  {formData.type === 'project' && 'Channel linked to a specific project'}
                </p>
              </div>

              {/* Channel Name - Optional for direct messages */}
              {formData.type !== 'direct' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Channel Name
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      formData.type === 'project'
                        ? 'e.g. project-team-chat'
                        : 'e.g. general-discussion'
                    }
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                </div>
              )}

              {/* Project Selection (only for project channels) */}
              {formData.type === 'project' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Project
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange('projectId', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Privacy Setting (not for direct channels) */}
              {formData.type !== 'direct' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Privacy
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!formData.isPrivate}
                        onChange={() => handleInputChange('isPrivate', false)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">Public</div>
                        <div className="text-xs text-gray-400">Anyone in the workspace can join</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        checked={formData.isPrivate}
                        onChange={() => handleInputChange('isPrivate', true)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-white">Private</div>
                        <div className="text-xs text-gray-400">Only invited members can join</div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Add Members */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add Members
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search and select users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                  />
                  
                  {/* Search Results */}
                  {(searchResults.length > 0 || searchLoading) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-600 rounded-md max-h-40 overflow-y-auto z-10">
                      {searchLoading ? (
                        <div className="p-3 text-gray-400 text-sm">Searching...</div>
                      ) : (
                        searchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleMemberToggle(user.id, user)}
                            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors ${
                              formData.selectedMembers.includes(user.id) ? 'bg-gray-800' : ''
                            }`}
                          >
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-300">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-xs text-gray-400">{user.email}</div>
                            </div>
                            {formData.selectedMembers.includes(user.id) && (
                              <CheckIcon className="w-4 h-4 text-blue-500" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                {/* Selected Members */}
                {selectedUsers.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-900 border border-gray-600 rounded-md">
                    <p className="text-sm text-gray-300 mb-2">
                      Selected members ({selectedUsers.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user) => (
                        <span
                          key={user.id}
                          className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full flex items-center gap-1"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => handleMemberToggle(user.id, user)}
                            className="hover:bg-blue-700 rounded-full p-0.5"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
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
                  disabled={loading || !formData.name.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {loading ? 'Creating...' : `Create ${formData.type === 'direct' ? 'DM' : 'Channel'}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
