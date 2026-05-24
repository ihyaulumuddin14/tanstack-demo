"use client";

import { useSession } from "@/features/auth/hooks/use-session";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";

export function NotificationBadge() {
  const { user } = useSession();
  const { data, isLoading, isPending } = useNotifications(user?.id);

  if (!user) return null;

  const count = data?.count ?? 0;
  const showSyncing = isLoading && !isPending;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Notifications</span>
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
        {count}
      </span>
      {showSyncing ? (
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-primary"
          aria-label="Syncing notifications"
        />
      ) : null}
    </div>
  );
}
