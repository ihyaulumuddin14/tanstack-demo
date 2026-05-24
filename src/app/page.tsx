"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/features/posts/hooks/use-posts";
import { useLikePost } from "@/features/posts/hooks/use-like-post";
import { useSession } from "@/features/auth/hooks/use-session";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";

export default function HomePage() {
  const router = useRouter();
  const { user, isPending: sessionPending } = useSession();
  const { mutate: signOut, isPending: signOutPending } = useSignOut();

  const { data, isLoading } = usePosts();
  const likeMutation = useLikePost();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!sessionPending && !user) {
      router.replace("/sign-in");
    }
  }, [sessionPending, user, router]);

  // Show loading while session resolves
  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <User className="size-3.5" />
            {user.name ?? user.email}
          </p>
        </div>

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

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((post: any) => (
            <div
              key={post._id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="mb-3 text-sm leading-relaxed">{post.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  ❤️ {post.likes}
                </span>
                <Button
                  id={`like-btn-${post._id}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => likeMutation.mutate(post._id)}
                  disabled={likeMutation.isPending}
                >
                  Like
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
