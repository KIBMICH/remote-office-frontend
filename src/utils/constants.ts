// API Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "api/auth/login",
    REGISTER: "api/auth/register",
    LOGOUT: "api/auth/logout",
    VERIFY: "api/auth/verify",
    GOOGLE: "api/auth/google",
  },
  USER: {
    PROFILE: "api/user/profile",
    UPDATE: "api/user/update",
  },
  // Additional explicit endpoints used by Settings integrations
  USERS: {
    UPDATE: "api/users/update", // PUT
    AVATAR: "api/users/avatar", // PATCH multipart/form-data
  },
  COMPANY: {
    UPDATE: "api/company/update", // PUT
    LOGO: "api/company/logo", // PATCH multipart/form-data
  },
  TEAM: {
    LIST: "api/teams",
    CREATE: "api/teams",
    UPDATE: "api/teams/:id",
    DELETE: "api/teams/:id",
  },
  PROJECT: {
    LIST: "api/projects",
    CREATE: "api/projects",
    UPDATE: "api/projects/:id",
    DELETE: "api/projects/:id",
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
