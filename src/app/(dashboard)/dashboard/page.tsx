"use client";
import React, { useState, useEffect } from "react";
import QuickActions from "@/components/dashboard/QuickActions";
import ActiveProjects from "@/components/dashboard/ActiveProjects";
import Productivity from "@/components/dashboard/Productivity";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import UnreadMessages from "@/components/dashboard/UnreadMessages";
import AddTaskModal from "@/components/projects/AddTaskModal";
import { useAuthContext } from "@/context/AuthContext";
import { dashboardService, type TeamMember } from "@/services/dashboardService";
import { projectService, type ProjectResponse } from "@/services/projectService";
import { type TaskResponse } from "@/services/taskService";

export default function DashboardPage() {
  const { user, loading } = useAuthContext();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [supportingDataLoading, setSupportingDataLoading] = useState(true);

  // Fetch supporting data for task creation
  const fetchSupportingData = async () => {
    try {
      setSupportingDataLoading(true);
      
      // Fetch team members
      const membersData = await dashboardService.getTeamMembers();
      setTeamMembers(membersData);
      
      // Fetch active projects for task assignment
      const projectsResponse = await projectService.getProjects({
        status: "active",
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc"
      });
      setProjects(projectsResponse.projects);
      
    } catch (err) {
      console.error("Failed to fetch supporting data:", err);
    } finally {
      setSupportingDataLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportingData();
  }, []);

  const handleTaskCreated = (newTask: TaskResponse) => {
    // Task created successfully, modal will close automatically
    // You could add additional logic here like refreshing dashboard data
    console.log("New task created:", newTask);
  };
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          {loading ? "Welcome back..." : `Welcome back, ${user?.name ?? "User"}!`}
        </h1>
        <p className="text-sm text-gray-300">Quick Actions</p>
      </header>

      <QuickActions onCreateTask={() => setIsTaskModalOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActiveProjects />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingMeetings />
            <UnreadMessages />
          </div>
        </div>
        <div className="space-y-6">
          <Productivity />
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        teamMembers={teamMembers}
        projects={projects}
      />
    </div>
  );
}
