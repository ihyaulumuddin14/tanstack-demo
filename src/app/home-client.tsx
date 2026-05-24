"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/hooks/use-session";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { NotificationBadge } from "@/features/notifications/components/notification-badge";
import { ComposePost } from "@/features/posts/components/compose-post";
import { PostsFeed } from "@/features/posts/components/posts-feed";
import { Loader2, LogOut, User } from "lucide-react";

export function HomeClient() {
  const { user: hookUser, isPending: sessionPending } = useSession();
  const { mutate: signOut, isPending: signOutPending } = useSignOut();

  const resolvedUser = hookUser;
  const showUserSkeleton = sessionPending && !resolvedUser;

  return (
    <div className="mx-auto w-full max-w-250 px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="size-3.5" />
            {showUserSkeleton ? (
              <span
                className="h-3 w-32 animate-pulse rounded-full bg-muted"
                aria-label="Loading user"
              />
            ) : (
              (resolvedUser?.name ?? resolvedUser?.email)
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBadge />
          <Button
            id="signout-btn"
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            disabled={signOutPending}
          >
            {signOutPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <LogOut className="size-4" />
                Sign out
              </>
            )}
          </Button>
        </div>
      </div>

      <ComposePost />

      {/* Posts Feed Component */}
      <PostsFeed />
    </div>
  );
}
