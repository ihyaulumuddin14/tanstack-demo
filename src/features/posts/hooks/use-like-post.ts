import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  likePost,
  type LikePostInput,
  type LikePostResponse,
} from "../api/like-post";
import type { GetPostsResponse } from "../api/get-posts";
import { postKeys } from "../lib/query-keys";

type LikePostContext = {
  previousFeed?: InfiniteData<GetPostsResponse>;
};

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation<LikePostResponse, Error, LikePostInput, LikePostContext>({
    mutationFn: likePost,

    onMutate: async (variables) => {
      // Optimistic UI: update the cache before the server responds.
      await queryClient.cancelQueries({ queryKey: postKeys.feed() });

      const previousFeed = queryClient.getQueryData<
        InfiniteData<GetPostsResponse>
      >(postKeys.feed());

      queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
        postKeys.feed(),
        (old) => {
          if (!old) return old;

          const delta = variables.action === "like" ? 1 : -1;
          const optimisticViewerId = "me";

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post._id === variables.postId
                  ? {
                      ...post,
                      likesCount: Math.max(0, post.likesCount + delta),
                      likedBy:
                        variables.action === "like"
                          ? Array.from(
                              new Set([
                                ...(post.likedBy ?? []),
                                optimisticViewerId,
                              ]),
                            )
                          : (post.likedBy ?? []).filter(
                              (id) => id !== optimisticViewerId,
                            ),
                      likedByMe: variables.action === "like",
                    }
                  : post,
              ),
            })),
          };
        },
      );

      return { previousFeed };
    },

    onError: (_error, _variables, context) => {
      // Rollback on failure: restore the previous snapshot.
      if (context?.previousFeed) {
        queryClient.setQueryData(postKeys.feed(), context.previousFeed);
      }
    },

    onSuccess: (updatedPost, variables) => {
      // Mutation lifecycle: reconcile optimistic cache with server data.
      queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
        postKeys.feed(),
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
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.feed(),
        refetchType: "inactive",
      });
    },
  });
}
