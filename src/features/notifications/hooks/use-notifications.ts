import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../api/get-unread-count";
import { notificationKeys } from "../lib/query-keys";

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId ?? "anonymous"),
    queryFn: getUnreadCount,
    enabled: Boolean(userId),
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: true,
    staleTime: 5 * 1000,
    retry: 1,
    gcTime: 3 * 1000
  });
}
