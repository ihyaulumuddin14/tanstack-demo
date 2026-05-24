import { IPost } from "../types";

export interface GetPostsResponse {
  posts: IPost[];
  nextCursor: string | null;
}

export interface GetPostsParams {
  cursor?: string | null;
  limit?: number;
  query?: string;
}

export async function getPosts(
  params: GetPostsParams = {},
): Promise<GetPostsResponse> {
  const searchParams = new URLSearchParams();

  if (params.cursor) {
    searchParams.set("cursor", params.cursor);
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.query) {
    searchParams.set("query", params.query);
  }

  const query = searchParams.toString();
  const response = await fetch(`/api/posts${query ? `?${query}` : ""}`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}
