import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../api/get-unread-count";
import { notificationKeys } from "../lib/query-keys";

// Polling is useful when you want periodic freshness without realtime infra.
// WebSockets push instantly; polling trades immediacy for simplicity.
// A badge is perfect server state: tiny payload, high UX impact.
export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId ?? "anonymous"),
    queryFn: getUnreadCount,
    enabled: Boolean(userId),
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 5 * 1000,
    retry: 1,
  });
}
