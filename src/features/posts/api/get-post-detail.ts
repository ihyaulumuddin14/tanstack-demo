import { QueryFunctionContext } from "@tanstack/react-query";
import type { IPost } from "../types";

type PostDetailKey = readonly ['posts', 'detail', string]

export async function getPostDetail(context: QueryFunctionContext<PostDetailKey>): Promise<IPost>{
  const [,,id] = context.queryKey;

  await new Promise(res => setTimeout(res, 20000))
  
  const response = await fetch(`/api/posts/${id}`, { 
    signal: context.signal
  });
  
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? "Failed to fetch post detail";
    throw new Error(message);
  }
  return response.json();
}