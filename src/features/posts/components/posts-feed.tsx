"use client";

import { useInfinitePosts } from "../hooks/use-infinite-posts";
import { useLikePost } from "../hooks/use-like-post";
import { useUserById } from "@/features/auth/hooks/use-user-by-id";
import type { IPost } from "../types";
import { Loader2, AlertCircle, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PostCardProps = {
  post: IPost;
  likeMutation: ReturnType<typeof useLikePost>;
};

function formatPostAge(isoDate: string) {
  const createdAt = new Date(isoDate);
  const timestamp = createdAt.getTime();

  if (Number.isNaN(timestamp)) return "Posted earlier";

  const diffMs = Math.max(0, Date.now() - timestamp);

  if (diffMs < 60 * 1000) return "Posted recently";

  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return "Posted earlier";
}

function PostCard({ post, likeMutation }: PostCardProps) {
  const { data: author, isPending: isAuthorPending } = useUserById(
    post.authorId,
  );
  const authorLabel = isAuthorPending
    ? "Loading author..."
    : (author?.name ?? author?.email ?? "Unknown author");

  const likedByMe = post.likedByMe ?? false;
  const isMutatingPost =
    likeMutation.isPending && likeMutation.variables?.postId === post._id;
  const nextAction = likedByMe ? "unlike" : "like";
  const timeLabel = formatPostAge(post.createdAt);

  return (
    <Card
      key={post._id}
      className="transition-shadow hover:shadow-md"
    >
      <CardContent className="p-4 sm:p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
          {post.content}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>{timeLabel}</span>
            <span>by {authorLabel}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={likedByMe ? "text-rose-600" : "text-muted-foreground"}
            aria-pressed={likedByMe}
            disabled={isMutatingPost}
            onClick={() =>
              likeMutation.mutate({
                postId: post._id,
                action: nextAction,
              })
            }
          >
            {isMutatingPost ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Heart
                className={
                  likedByMe ? "size-3 text-rose-600 fill-rose-600" : "size-3"
                }
              />
            )}
            {likedByMe ? "Unlike" : "Like"} {post.likesCount}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PostsFeed() {
  // isPending = First time loading (no cache yet)
  // isFetching = Any time a request is in flight (including background refetches)
  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();
  const likeMutation = useLikePost();
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];
  const isBackgroundFetching = isFetching && !isFetchingNextPage;

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
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-muted-foreground">
        <p className="text-sm font-medium">No posts yet.</p>
        <p className="mt-1 text-xs opacity-80">
          Be the first to post something!
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {isBackgroundFetching && (
        <div className="absolute -top-8 right-0 flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary shadow-sm">
          <RefreshCw className="size-3 animate-spin" />
          Background Refetching
        </div>
      )}

      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          likeMutation={likeMutation}
        />
      ))}

      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading more
              </>
            ) : (
              "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
