import { IPost } from "../types";

export interface CreatePostInput {
  content: string;
}

export async function createPost(input: CreatePostInput): Promise<IPost> {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to create post";
    throw new Error(message);
  }

  return response.json();
}
