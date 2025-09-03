export interface APIError {
  message: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

declare global {
  // add any global type extensions here
}

export {};
