"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCreatePost } from "../hooks/use-create-post";

export function ComposePost() {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending, isError, error } = useCreatePost();

  const trimmedContent = content.trim();
  const canSubmit = trimmedContent.length > 0 && !isPending;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedContent) return;

    mutate(
      { content: trimmedContent },
      {
        onSuccess: () => {
          setContent("");
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Card className="mb-24">
      <CardContent className="py-4">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full rounded-md border border-dashed border-border px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          aria-expanded={isOpen}
        >
          What&apos;s on your mind?
        </button>
      </CardContent>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-105 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-0">
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
                ? error instanceof Error
                  ? error.message
                  : "Failed to post"
                : "Posts appear instantly with optimistic updates."}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Send className="size-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </div>
    </Card>
  );
}
