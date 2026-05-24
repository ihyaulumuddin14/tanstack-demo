export interface DeletePostInput {
  postId: string;
}

export async function deletePost(input: DeletePostInput): Promise<{ ok: true }> {
  const response = await fetch(`/api/posts/${input.postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to delete post";
    throw new Error(message);
  }

  return response.json();
}
