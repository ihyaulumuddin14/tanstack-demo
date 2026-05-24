export interface UserSummary {
  id: string;
  name: string | null;
  email: string | null;
}

export async function getUserById(userId: string): Promise<UserSummary> {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to load user";
    throw new Error(message);
  }

  return response.json();
}
