import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/get-posts";
import { postKeys } from "../lib/query-keys";

export function usePosts() {
  return useQuery({
    queryKey: postKeys.all,
    queryFn: getPosts,
  });
}
