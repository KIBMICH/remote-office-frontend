"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import AddProjectModal from "@/components/projects/AddProjectModal";
import type { Project } from "@/types/project";

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Remote Office Platform",
    description: "Complete remote work management platform with task tracking, team collaboration, and project management features",
    status: "active",
    priority: "high",
    dueDate: "2024-12-15",
    progress: 75,
    members: [
      { id: "1", name: "John Smith", avatarUrl: "" },
      { id: "2", name: "Alice Johnson", avatarUrl: "" },
      { id: "3", name: "Bob Brown", avatarUrl: "" },
    ],
    taskCount: 24,
    completedTasks: 18,
    createdAt: "2024-01-15",
    tags: ["web", "react", "nodejs"],
  },
  {
    id: "2",
    name: "Mobile App Integration",
    description: "Native mobile application for iOS and Android with offline capabilities and real-time synchronization",
    status: "active",
    priority: "medium",
    dueDate: "2024-11-30",
    progress: 40,
    members: [
      { id: "4", name: "Charlie Davis", avatarUrl: "" },
      { id: "5", name: "Eva Green", avatarUrl: "" },
    ],
    taskCount: 15,
    completedTasks: 6,
    createdAt: "2024-02-01",
    tags: ["mobile", "react-native", "api"],
  },
  {
    id: "3",
    name: "AI Feature Development",
    description: "Machine learning integration for smart task recommendations and automated workflow optimization",
    status: "active",
    priority: "high",
    dueDate: "2024-10-20",
    progress: 90,
    members: [
      { id: "6", name: "Frank Moore", avatarUrl: "" },
      { id: "7", name: "Grace Hall", avatarUrl: "" },
      { id: "8", name: "Henry King", avatarUrl: "" },
    ],
    taskCount: 12,
    completedTasks: 11,
    createdAt: "2024-03-10",
    tags: ["ai", "ml", "python"],
  },
  {
    id: "4",
    name: "Security Audit & Compliance",
    description: "Comprehensive security review and implementation of compliance standards (SOC2, GDPR)",
    status: "on_hold",
    priority: "medium",
    dueDate: "2025-01-31",
    progress: 25,
    members: [
      { id: "9", name: "Ivy Chen", avatarUrl: "" },
    ],
    taskCount: 8,
    completedTasks: 2,
    createdAt: "2024-04-05",
    tags: ["security", "compliance", "audit"],
  },
  {
    id: "5",
    name: "Documentation Portal",
    description: "Comprehensive documentation website with API references, user guides, and developer resources",
    status: "completed",
    priority: "low",
    dueDate: "2024-08-30",
    progress: 100,
    members: [
      { id: "10", name: "Jack Wilson", avatarUrl: "" },
      { id: "11", name: "Kate Brown", avatarUrl: "" },
    ],
    taskCount: 6,
    completedTasks: 6,
    createdAt: "2024-06-01",
    tags: ["documentation", "website", "guides"],
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

export default function ProjectListPage() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (projectId: string, newStatus: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus as Project['status'] } : project
    ));
  };

  const handleDelete = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
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

      {/* Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Project</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden lg:table-cell">Members</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden md:table-cell">Progress</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell">Due Date</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Priority</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Status</th>
                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-300">Actions</th>
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
                        <div className="text-xs text-gray-400">Due: <span className="text-gray-300">{project.dueDate}</span></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 3).map((member, index) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full bg-gray-600 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-white"
                          title={member.name}
                        >
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      ))}
                      {project.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-medium text-gray-300">
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
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-300 text-sm hidden sm:table-cell">{project.dueDate}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <span className={`capitalize text-xs sm:text-sm font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
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

      {/* Empty state if no projects */}
      {projects.length === 0 && (
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
      />
    </section>
  );
}
