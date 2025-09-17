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
  PROJECT: {
    LIST: "projects",
    CREATE: "projects",
    UPDATE: "projects/:id",
    DELETE: "projects/:id",
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
