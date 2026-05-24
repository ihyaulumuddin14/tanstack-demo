import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, type CreatePostInput } from "../api/create-post";
import { postKeys } from "../lib/query-keys";
import type { GetPostsResponse } from "../api/get-posts";
import type { IPost } from "../types";

type CreatePostContext = {
  previousFeed?: GetPostsResponse;
  optimisticId: string;
};

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onMutate: async (input: CreatePostInput): Promise<CreatePostContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.feed() });

      const previousFeed = queryClient.getQueryData<GetPostsResponse>(
        postKeys.feed()
      );

      const optimisticPost: IPost = {
        _id: `optimistic-${Date.now()}`,
        content: input.content,
        likes: 0,
        authorId: "me",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Manual cache manipulation: insert immediately for an instant UI update.
      queryClient.setQueryData<GetPostsResponse>(postKeys.feed(), (old) => {
        const posts = old?.posts ?? [];

        return {
          posts: [optimisticPost, ...posts],
          nextCursor: old?.nextCursor ?? null,
        };
      });

      return { previousFeed, optimisticId: optimisticPost._id };
    },

    onError: (_error, _input, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(postKeys.feed(), context.previousFeed);
        return;
      }

      queryClient.removeQueries({ queryKey: postKeys.feed(), exact: true });
    },

    onSuccess: (createdPost, _input, context) => {
      // Cache synchronization: swap optimistic post for the server-confirmed one.
      queryClient.setQueryData<GetPostsResponse>(postKeys.feed(), (old) => {
        if (!old?.posts) {
          return { posts: [createdPost], nextCursor: null };
        }

        const hasOptimistic = old.posts.some(
          (post) => post._id === context?.optimisticId
        );

        const posts = hasOptimistic
          ? old.posts.map((post) =>
              post._id === context?.optimisticId ? createdPost : post
            )
          : [createdPost, ...old.posts];

        return { ...old, posts };
      });
    },

    onSettled: () => {
      // Invalidate inactive feeds to keep data fresh without refetching live UI.
      queryClient.invalidateQueries({
        queryKey: postKeys.feed(),
        refetchType: "inactive",
      });
    },
  });
}
