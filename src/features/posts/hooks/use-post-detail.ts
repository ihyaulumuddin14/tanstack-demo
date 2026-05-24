import { useQuery } from "@tanstack/react-query";
import { getPostDetail } from "../api/get-post-detail";
import { postKeys } from "../lib/query-keys";

export function usePostDetail(postId: string, enabled = true) {
  return useQuery({
    // Detail views use a dedicated key so list pagination and detail fetches
    // stay isolated (no normalized cache required in TanStack Query).
    queryKey: postKeys.detail(postId),
    queryFn: () => getPostDetail(postId),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}
