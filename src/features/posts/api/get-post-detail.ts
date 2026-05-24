import type { IPost } from "../types";

export async function getPostDetail(postId: string): Promise<IPost> {
  const response = await fetch(`/api/posts/${postId}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to fetch post detail";
    throw new Error(message);
  }

  return response.json();
}
