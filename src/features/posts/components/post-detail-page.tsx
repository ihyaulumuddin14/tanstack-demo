"use client";

import { usePostDetail } from "../hooks/use-post-detail";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

type PostDetailPageProps = {
  postId: string;
};

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const { data, isPending, isError, error } = usePostDetail(postId);

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading post detail...
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 p-6 text-sm text-destructive">
          <AlertCircle className="size-4" />
          {error instanceof Error ? error.message : "Failed to load post"}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Post not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-6">
        <div className="text-xs font-medium text-muted-foreground">Post Detail</div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base">
          {data.content}
        </p>
        <div className="text-xs text-muted-foreground">
          Created: {new Date(data.createdAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
