"use client";

import { usePosts } from "../hooks/use-posts";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PostsFeed() {
  // isPending = First time loading (no cache yet)
  // isFetching = Any time a request is in flight (including background refetches)
  const { data, isPending, isError, error, isFetching } = usePosts();

  // 1. LOADING STATE: Shown ONLY when we have no data in cache
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-muted-foreground">
        <Loader2 className="mb-4 size-8 animate-spin" />
        <p className="text-sm font-medium">Fetching feed...</p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-destructive/50 bg-destructive/5 py-16 text-destructive">
        <AlertCircle className="mb-4 size-8" />
        <p className="text-sm font-medium">Error loading posts</p>
        <p className="mt-1 text-xs opacity-80">{error.message}</p>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-muted-foreground">
        <p className="text-sm font-medium">No posts yet.</p>
        <p className="mt-1 text-xs opacity-80">Be the first to post something!</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {isFetching && (
        <div className="absolute -top-8 right-0 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm">
          <RefreshCw className="size-3 animate-spin" />
          Background Refetching
        </div>
      )}

      {data.posts.map((post) => (
        <Card key={post._id} className="transition-shadow hover:shadow-md">
          <CardContent className="p-4 sm:p-6">
            <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
              {post.content}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="rounded-full bg-muted px-2 py-0.5">
                ❤️ {post.likes}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
