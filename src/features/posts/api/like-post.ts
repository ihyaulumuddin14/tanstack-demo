import type { IPost } from "../types";

export type LikePostAction = "like" | "unlike";

export interface LikePostInput {
  postId: string;
  action: LikePostAction;
}

export type LikePostResponse = IPost & { likedByMe?: boolean };

export async function likePost({
  postId,
  action,
}: LikePostInput): Promise<LikePostResponse> {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to update like";
    throw new Error(message);
  }

  return response.json();
}
