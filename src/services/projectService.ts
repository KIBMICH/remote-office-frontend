import api from "@/utils/api";

export type ProjectResponse = {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold" | "cancelled";
  priority?: "high" | "medium" | "low";
  dueDate: string;
  progress: number;
  memberIds: string[];
  members: {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
  }[];
  taskCount: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type CreateProjectPayload = {
  name: string;
  description: string;
  dueDate: string;
  memberIds?: string[];
};

export type UpdateProjectPayload = {
  name?: string;
  description?: string;
  dueDate?: string;
  status?: "active" | "completed" | "on_hold" | "cancelled";
  memberIds?: string[];
};

export type ProjectsResponse = {
  projects: ProjectResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProjectFilters = {
  status?: "active" | "completed" | "on_hold" | "cancelled";
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "dueDate" | "name" | "progress";
  sortOrder?: "asc" | "desc";
};

export type AddMembersPayload = {
  memberIds: string[];
};

export const projectService = {
  // Get all projects with filtering and pagination
  getProjects: async (filters: ProjectFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `projects?${queryString}` : "projects";
    
    const { data } = await api.get<ProjectsResponse>(url);
    return data;
  },

  // Get a specific project by ID
  getProject: async (projectId: string) => {
    const { data } = await api.get<ProjectResponse>(`projects/${projectId}`);
    return data;
  },

  // Create a new project
  createProject: async (payload: CreateProjectPayload) => {
    console.log("ProjectService: Creating project with payload:", payload);
    console.log("ProjectService: API base URL:", api.defaults.baseURL);
    
    try {
      const { data } = await api.post<ProjectResponse>("projects", payload);
      console.log("ProjectService: Project created successfully:", data);
      return data;
    } catch (error: unknown) {
      console.error("ProjectService: Create project failed:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number }; config?: unknown };
        console.error("ProjectService: Error response:", axiosError.response?.data);
        console.error("ProjectService: Error status:", axiosError.response?.status);
        console.error("ProjectService: Request config:", axiosError.config);
      }
      throw error;
    }
  },

  // Update an existing project
  updateProject: async (projectId: string, payload: UpdateProjectPayload) => {
    const { data } = await api.put<ProjectResponse>(`projects/${projectId}`, payload);
    return data;
  },

  // Delete a project
  deleteProject: async (projectId: string) => {
    await api.delete(`projects/${projectId}`);
  },

  // Get all tasks for a specific project
  getProjectTasks: async (projectId: string, filters?: {
    status?: "todo" | "in_progress" | "done";
    assignee?: string;
    priority?: "high" | "medium" | "low";
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append("status", filters.status);
    if (filters?.assignee) params.append("assignee", filters.assignee);
    if (filters?.priority) params.append("priority", filters.priority);

    const queryString = params.toString();
    const url = queryString ? `projects/${projectId}/tasks?${queryString}` : `projects/${projectId}/tasks`;
    
    const { data } = await api.get(url);
    return data;
  },

  // Add members to a project
  addProjectMembers: async (projectId: string, payload: AddMembersPayload) => {
    console.log("ProjectService: Adding members to project:", projectId, payload);
    try {
      const { data } = await api.post(`projects/${projectId}/members`, payload);
      console.log("ProjectService: Members added successfully:", data);
      return data;
    } catch (error: unknown) {
      console.error("ProjectService: Add members failed:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        console.error("ProjectService: Error response:", axiosError.response?.data);
      }
      throw error;
    }
  },

  // Remove a member from a project
  removeProjectMember: async (projectId: string, userId: string) => {
    await api.delete(`projects/${projectId}/members/${userId}`);
  },
};

export default projectService;
