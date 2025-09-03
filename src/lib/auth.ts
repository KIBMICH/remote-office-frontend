export type User = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUser(): Promise<User | null> {
  // Placeholder: replace with real API call
  return null;
}
