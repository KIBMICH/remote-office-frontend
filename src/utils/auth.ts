// Utility functions for handling authentication tokens

export const setAuthToken = (token: string) => {
  // Set in localStorage for client-side access
  localStorage.setItem("token", token);
  
  // Set as httpOnly cookie for server-side middleware access
  // Note: This sets a client-side cookie, for production you'd want httpOnly cookies set by the server
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

export const removeAuthToken = () => {
  // Remove from localStorage
  localStorage.removeItem("token");
  
  // Remove cookie by setting it to expire
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};
