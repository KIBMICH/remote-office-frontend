import api from "@/utils/api";

export type TaskResponse = {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  projectId?: string;
  project?: {
    id: string;
    name: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type CreateTaskPayload = {
  title: string;
  description: string;
  assigneeId?: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  projectId?: string;
  tags?: string[];
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
  status?: "todo" | "in_progress" | "done";
  projectId?: string;
  tags?: string[];
};

export type TasksResponse = {
  tasks: TaskResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TaskFilters = {
  status?: "todo" | "in_progress" | "done";
  priority?: "high" | "medium" | "low";
  assignee?: string;
  project?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "dueDate" | "priority" | "status";
  sortOrder?: "asc" | "desc";
};

export type UpdateTaskStatusPayload = {
  status: "todo" | "in_progress" | "done";
};

export const taskService = {
  // Get all tasks with filtering and pagination
  getTasks: async (filters: TaskFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.assignee) params.append("assignee", filters.assignee);
    if (filters.project) params.append("project", filters.project);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `tasks?${queryString}` : "tasks";
    
    const { data } = await api.get<TasksResponse>(url);
    return data;
  },

  // Get a specific task by ID
  getTask: async (taskId: string) => {
    const { data } = await api.get<TaskResponse>(`tasks/${taskId}`);
    return data;
  },

  // Create a new task
  createTask: async (payload: CreateTaskPayload) => {
    console.log("TaskService: Creating task with payload:", payload);
    console.log("TaskService: Payload JSON:", JSON.stringify(payload, null, 2));
    
    try {
      const { data } = await api.post<TaskResponse>("tasks", payload);
      console.log("TaskService: Task created successfully:", data);
      return data;
    } catch (error: any) {
      console.error("TaskService: Create task failed:", error);
      console.error("TaskService: Error response:", error.response?.data);
      console.error("TaskService: Error status:", error.response?.status);
      throw error;
    }
  },

  // Update an existing task
  updateTask: async (taskId: string, payload: UpdateTaskPayload) => {
    const { data } = await api.put<TaskResponse>(`tasks/${taskId}`, payload);
    return data;
  },

  // Update only the task status
  updateTaskStatus: async (taskId: string, payload: UpdateTaskStatusPayload) => {
    const { data } = await api.patch<TaskResponse>(`tasks/${taskId}/status`, payload);
    return data;
  },

  // Delete a task
  deleteTask: async (taskId: string) => {
    await api.delete(`tasks/${taskId}`);
  },

  // Get tasks assigned to the current user
  getMyTasks: async (filters?: {
    status?: "todo" | "in_progress" | "done";
    priority?: "high" | "medium" | "low";
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `tasks/my-tasks?${queryString}` : "tasks/my-tasks";
    
    const { data } = await api.get<TasksResponse>(url);
    return data;
  },
};

export default taskService;
