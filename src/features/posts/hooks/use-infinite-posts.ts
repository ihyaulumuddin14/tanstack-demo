import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/get-posts";
import { postKeys } from "../lib/query-keys";

const PAGE_SIZE = 5;

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.feed(),
    queryFn: ({ pageParam }) =>
      getPosts({ cursor: pageParam ?? null, limit: PAGE_SIZE }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 10 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}
