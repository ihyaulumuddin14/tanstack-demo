import { IPost } from "../types";

export interface GetPostsResponse {
  posts: IPost[];
  nextCursor: string | null;
}

export async function getPosts(): Promise<GetPostsResponse> {
  const response = await fetch("/api/posts");
  
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}