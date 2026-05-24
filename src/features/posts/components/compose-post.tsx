"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCreatePost } from "../hooks/use-create-post";

export function ComposePost() {
  const [content, setContent] = useState("");
  const { mutate, isPending, isError, error } = useCreatePost();

  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedContent) return;

    mutate(
      { content: trimmedContent },
      {
        onSuccess: () => setContent(""),
      }
    );
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share something with the workshop..."
            rows={4}
            className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            disabled={isPending}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t">
          <div className="text-xs text-muted-foreground">
            {isError
              ? (error instanceof Error ? error.message : "Failed to post")
              : "Posts appear instantly with optimistic updates."}
          </div>
          <Button type="submit" size="sm" disabled={!canSubmit}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="size-4" />
                Post
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
