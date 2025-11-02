// API Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "auth/login",
    REGISTER: "auth/register",
    LOGOUT: "auth/logout",
    VERIFY: "auth/verify",
    GOOGLE: "auth/google",
  },
  USER: {
    PROFILE: "user/profile",
    UPDATE: "user/update",
  },
  // Additional explicit endpoints used by Settings integrations
  USERS: {
    UPDATE: "users/update", // PUT
    AVATAR: "users/avatar", // PATCH multipart/form-data
  },
  COMPANY: {
    GET: "company", // GET - role-based: superadmin gets all, others get own company
    UPDATE: "company/update", // PUT
    LOGO: "company/logo", // PATCH multipart/form-data
  },
  TEAM: {
    LIST: "teams",
    CREATE: "teams",
    UPDATE: "teams/:id",
    DELETE: "teams/:id",
  },
  PROJECTS: {
    LIST: "projects",
    CREATE: "projects",
    GET: "projects/:id",
    UPDATE: "projects/:id",
    DELETE: "projects/:id",
    TASKS: "projects/:id/tasks",
    ADD_MEMBERS: "projects/:id/members",
    REMOVE_MEMBER: "projects/:id/members/:userId",
  },
  TASKS: {
    LIST: "tasks",
    CREATE: "tasks",
    GET: "tasks/:id",
    UPDATE: "tasks/:id",
    DELETE: "tasks/:id",
    UPDATE_STATUS: "tasks/:id/status",
    MY_TASKS: "tasks/my-tasks",
  },
  DASHBOARD: {
    STATS: "dashboard/stats",
    ACTIVE_PROJECTS: "dashboard/active-projects",
    TASK_ANALYTICS: "dashboard/task-analytics",
    PROJECT_ANALYTICS: "dashboard/project-analytics",
    TEAM_MEMBERS: "dashboard/team-members",
  },
  CHAT: {
    CHANNELS: "chat/channels",
    CREATE_CHANNEL: "chat/channels",
    GET_CHANNEL_MESSAGES: "chat/channels/:channelId/messages",
    SEND_MESSAGE: "chat/channels/:channelId/messages",
    EDIT_MESSAGE: "chat/messages/:messageId",
    DELETE_MESSAGE: "chat/messages/:messageId",
    MARK_AS_READ: "chat/channels/:channelId/read",
    SEARCH_USERS: "chat/users/search",
    JOIN_CHANNEL: "chat/channels/:channelId/join",
    LEAVE_CHANNEL: "chat/channels/:channelId/leave",
    GET_CHANNEL_USERS: "chat/channels/:channelId/users",
    UPLOAD_FILE: "chat/upload",
  },
  MEETINGS: {
    STATS: "meetings/stats",
    LIST: "meetings",
    GET: "meetings/:meetingId",
    CREATE: "meetings",
    UPDATE: "meetings/:meetingId",
    DELETE: "meetings/:meetingId",
    START: "meetings/:meetingId/start",
    END: "meetings/:meetingId/end",
    PARTICIPANTS: "meetings/:meetingId/participants",
    ADD_PARTICIPANTS: "meetings/:meetingId/participants",
    REMOVE_PARTICIPANT: "meetings/:meetingId/participants/:userId",
    UPDATE_PARTICIPANT_ROLE: "meetings/:meetingId/participants/:userId",
    JOIN: "meetings/:meetingId/join",
    LEAVE: "meetings/:meetingId/leave",
    RESPOND: "meetings/:meetingId/respond",
    SUMMARY: "meetings/:meetingId/summary",
    REGENERATE_SUMMARY: "meetings/:meetingId/summary",
  },
  AGORA: {
    RTC_TOKEN: "agora/token",
    RTM_TOKEN: "agora/rtm-token",
    VALIDATE_ROOM: "agora/validate/:roomName",
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: "RemoteHub",
  DESCRIPTION: "Empowering remote teams with powerful collaboration tools",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@remotehub.com",
} as const;

// Feature Flags
export const FEATURES = {
  TEAM_COLLABORATION: true,
  PROJECT_MANAGEMENT: true,
  TIME_TRACKING: true,
  FILE_MANAGEMENT: true,
  ANALYTICS: true,
  INTEGRATIONS: true,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: [".pdf", ".doc", ".docx", ".txt", ".jpg", ".png", ".gif"],
} as const;
