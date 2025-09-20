import api from "@/utils/api";

export type DashboardStats = {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  teamMembers: number;
};

export type ActiveProject = {
  id: string;
  name: string;
  description: string;
  progress: number;
  dueDate: string;
  status: "active" | "completed" | "on_hold" | "cancelled";
  taskCount: number;
  completedTasks: number;
  members: {
    id: string;
    name: string;
    avatarUrl?: string;
  }[];
};

export type TaskAnalytics = {
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  statusDistribution: {
    todo: number;
    in_progress: number;
    done: number;
  };
  completionRate: number;
  averageCompletionTime: number; // in days
  overdueCount: number;
};

export type ProjectAnalytics = {
  statusDistribution: {
    active: number;
    completed: number;
    on_hold: number;
    cancelled: number;
  };
  averageProgress: number;
  projectsOnTrack: number;
  projectsAtRisk: number;
  completionRate: number;
};

export type TeamMember = {
  id?: string;
  _id?: string; // Backend uses _id instead of id
  name: string;
  email: string;
  avatarUrl?: string;
  jobTitle?: string;
  role?: string; // Backend includes role field
  status?: string;
  tasksAssigned?: number;
  tasksCompleted?: number;
};

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const { data } = await api.get<DashboardStats>("dashboard/stats");
    return data;
  },

  // Get active projects with progress information
  getActiveProjects: async () => {
    const { data } = await api.get<ActiveProject[]>("dashboard/active-projects");
    return data;
  },

  // Get task analytics
  getTaskAnalytics: async () => {
    const { data } = await api.get<TaskAnalytics>("dashboard/task-analytics");
    return data;
  },

  // Get project analytics
  getProjectAnalytics: async () => {
    const { data } = await api.get<ProjectAnalytics>("dashboard/project-analytics");
    return data;
  },

  // Get all team members
  getTeamMembers: async () => {
    
    try {
      const { data } = await api.get<{ users: TeamMember[] }>("dashboard/team-members");
      
      
      // Extract the users array from the response
      const teamMembers = data.users || [];
    
      
      // Transform the data to match our expected format (id instead of _id)
      const transformedMembers = teamMembers.map(member => ({
        ...member,
        id: member._id || member.id, // Use _id as id if available
      }));
      
      
      return transformedMembers;
    } catch (error: unknown) {
      console.error("DashboardService: Failed to fetch team members:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error("DashboardService: Error response:", axiosError.response?.data);
        console.error("DashboardService: Error status:", axiosError.response?.status);
      }
      throw error;
    }
  },
};

export default dashboardService;
