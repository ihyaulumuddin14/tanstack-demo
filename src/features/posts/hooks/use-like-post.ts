import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  likePost,
  type LikePostInput,
  type LikePostResponse,
} from "../api/like-post";
import type { GetPostsResponse } from "../api/get-posts";
import { postKeys } from "../lib/query-keys";
import type { IPost } from "../types";
import { useSession } from "@/features/auth/hooks/use-session";

type LikePostContext = {
  previousFeeds?: Array<
    [readonly unknown[], InfiniteData<GetPostsResponse> | undefined]
  >;
  previousDetail?: IPost | undefined;
};

export function useLikePost() {
  const queryClient = useQueryClient();
  const { user } = useSession();

  return useMutation<LikePostResponse, Error, LikePostInput, LikePostContext>({
    mutationFn: likePost,

    onMutate: async (variables) => {
      // Optimistic UI: update the cache before the server responds.
      await queryClient.cancelQueries({ queryKey: postKeys.search("") });
      await queryClient.cancelQueries({
        queryKey: postKeys.detail(variables.postId),
      });

      const previousFeeds = queryClient.getQueriesData<
        InfiniteData<GetPostsResponse>
      >({ queryKey: postKeys.search("") });
      const previousDetail = queryClient.getQueryData<IPost>(
        postKeys.detail(variables.postId),
      );

      const optimisticViewerId = user?.id ?? "viewer";
      const delta = variables.action === "like" ? 1 : -1;

      const applyOptimisticLike = (post: IPost) => ({
        ...post,
        likesCount: Math.max(0, post.likesCount + delta),
        likedBy:
          variables.action === "like"
            ? Array.from(new Set([...(post.likedBy ?? []), optimisticViewerId]))
            : (post.likedBy ?? []).filter((id) => id !== optimisticViewerId),
        likedByMe: variables.action === "like",
      });

      previousFeeds.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          queryKey,
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                posts: page.posts.map((post) =>
                  post._id === variables.postId
                    ? applyOptimisticLike(post)
                    : post,
                ),
              })),
            };
          },
        );
      });

      if (previousDetail) {
        queryClient.setQueryData(
          postKeys.detail(variables.postId),
          applyOptimisticLike(previousDetail),
        );
      }

      return { previousFeeds, previousDetail };
    },

    onError: (_error, variables, context) => {
      // Rollback on failure: restore the previous snapshot.
      if (context?.previousFeeds?.length) {
        context.previousFeeds.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          postKeys.detail(variables.postId),
          context.previousDetail,
        );
      }
    },

    onSuccess: (updatedPost, variables) => {
      // Mutation lifecycle: reconcile optimistic cache with server data.
      const searchQueries = queryClient.getQueriesData<
        InfiniteData<GetPostsResponse>
      >({ queryKey: postKeys.search("") });

      searchQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          queryKey,
          (old) => {
            if (!old) return old;

            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                posts: page.posts.map((post) =>
                  post._id === variables.postId
                    ? {
                        ...post,
                        ...updatedPost,
                        likedByMe:
                          updatedPost.likedByMe ?? variables.action === "like",
                      }
                    : post,
                ),
              })),
            };
          },
        );
      });

      queryClient.setQueryData(
        postKeys.detail(variables.postId),
        (old?: IPost) => (old ? { ...old, ...updatedPost } : old),
      );
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.search(""),
        refetchType: "inactive",
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(variables.postId),
      });
    },
  });
}
