export const notificationKeys = {
  all: ["notifications"] as const,
  unreadCount: (userId: string) =>
    [...notificationKeys.all, "unread-count", userId] as const,
};
