"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AddProjectModal from "@/components/projects/AddProjectModal";
import EditProjectMembersModal from "@/components/projects/EditProjectMembersModal";
// Removed unused Project type import
import { projectService, type ProjectResponse, type ProjectFilters } from "@/services/projectService";
import { dashboardService, type TeamMember } from "@/services/dashboardService";

// Removed MOCK_PROJECTS - now using real API data

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
    case "active":
      return "bg-blue-600 text-blue-100";
    case "completed":
      return "bg-green-600 text-green-100";
    case "on_hold":
      return "bg-yellow-600 text-yellow-100";
    case "cancelled":
      return "bg-red-600 text-red-100";
    default:
      return "bg-gray-600 text-gray-200";
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "on_hold":
      return "On Hold";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-500";
  return "bg-red-500";
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

export default function ProjectListPage() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMembersModalOpen, setIsEditMembersModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const [, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjects(filters);
      setProjects(response.projects);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages
      });
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members for project creation
  const fetchTeamMembers = async () => {
    try {
    
      const members = await dashboardService.getTeamMembers();
    
      setTeamMembers(members);
    } catch (err) {
      console.error("Failed to fetch team members:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      await projectService.updateProject(projectId, { 
        status: newStatus as ProjectResponse['status'] 
      });
      
      // Update local state
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status: newStatus as ProjectResponse['status'] } : project
      ));
    } catch (err) {
      console.error("Failed to update project status:", err);
      setError("Failed to update project status. Please try again.");
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  const handleProjectCreated = (newProject: ProjectResponse) => {
    setProjects(prev => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  const handleEditMembers = (project: ProjectResponse) => {
    setSelectedProject(project);
    setIsEditMembersModalOpen(true);
  };

  const handleMembersUpdated = (updatedProject: ProjectResponse) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
    setIsEditMembersModalOpen(false);
    setSelectedProject(null);
  };

  const handleCloseEditMembers = () => {
    setIsEditMembersModalOpen(false);
    setSelectedProject(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
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
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">Project List</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 sm:px-4 sm:py-2"
            size="sm"
          >
            <span className="text-lg leading-none sm:hidden">+</span>
            <span className="hidden sm:inline">New Project</span>
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
            <span className="ml-3 text-gray-300">Loading projects...</span>
          </div>
        </div>
      ) : (
        /* Table */
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 w-[30%]">Project</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden lg:table-cell w-[15%]">Members</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden md:table-cell w-[15%]">Progress</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell w-[12%]">Due Date</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 w-[8%]">Priority</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 w-[10%]">Status</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div>
                      <div className="font-medium text-white text-sm sm:text-base">{project.name}</div>
                      <div className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</div>
                      <div className="sm:hidden mt-2 space-y-1">
                        <div className="text-xs text-gray-400">
                          Progress: <span className="text-gray-300">{project.progress}%</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Tasks: <span className="text-gray-300">{project.completedTasks}/{project.taskCount}</span>
                        </div>
                        <div className="text-xs text-gray-400">Due: <span className="text-gray-300">{formatDate(project.dueDate)}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member, index) => (
                        <div
                          key={member.id || `member-${project.id}-${index}`}
                          className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-white"
                          title={member.name}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {project.members.length > 3 && (
                        <div 
                          key={`extra-members-${project.id}`}
                          className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-gray-300"
                        >
                          +{project.members.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-300 min-w-[3rem]">{project.progress}%</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {project.completedTasks}/{project.taskCount} tasks
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-sm hidden sm:table-cell">{formatDate(project.dueDate)}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <span className={`capitalize text-xs sm:text-sm font-medium ${getPriorityColor(project.priority || "medium")}`}>
                      {project.priority || "medium"}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {formatStatus(project.status)}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs px-2 py-1"
                      >
                        <span className="sm:hidden">👁️</span>
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs px-2 py-1"
                        onClick={() => handleEditMembers(project)}
                      >
                        <span className="sm:hidden">✏️</span>
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-1 sm:px-2 py-1 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on_hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-600 hover:bg-red-600 hover:text-white text-xs px-2 py-1"
                        onClick={() => handleDelete(project.id)}
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

      {/* Empty state if no projects */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-10 sm:h-12 w-10 sm:w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No projects found</h3>
          <p className="text-sm sm:text-base text-gray-400 mb-4 max-w-md mx-auto">Get started by creating your first project.</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            Create Project
          </Button>
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        teamMembers={teamMembers}
      />

      {/* Edit Project Members Modal */}
      <EditProjectMembersModal
        isOpen={isEditMembersModalOpen}
        onClose={handleCloseEditMembers}
        project={selectedProject}
        onMembersUpdated={handleMembersUpdated}
      />
    </section>
  );
}
