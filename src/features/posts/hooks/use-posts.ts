import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/get-posts";
import { postKeys } from "../lib/query-keys";

export function usePosts() {
  return useQuery({
    queryKey: postKeys.feed(),
    queryFn: () => getPosts(),
    staleTime: 10 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}
