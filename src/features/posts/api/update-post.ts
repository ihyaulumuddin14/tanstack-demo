import type { IPost } from "../types";

export interface UpdatePostInput {
  postId: string;
  content: string;
}

export async function updatePost(input: UpdatePostInput): Promise<IPost> {
  const response = await fetch(`/api/posts/${input.postId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: input.content }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to update post";
    throw new Error(message);
  }

  return response.json();
}
