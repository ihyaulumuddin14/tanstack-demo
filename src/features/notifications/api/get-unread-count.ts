import type { NotificationUnreadCountResponse } from "../types";

export async function getUnreadCount(): Promise<NotificationUnreadCountResponse> {
  const response = await fetch("/api/notifications/unread-count");

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  return response.json();
}
