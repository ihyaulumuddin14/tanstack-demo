import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, type DeletePostInput } from "../api/delete-post";
import { postKeys } from "../lib/query-keys";
import type { GetPostsResponse } from "../api/get-posts";
import type { IPost } from "../types";

type DeletePostContext = {
  previousFeeds?: Array<
    [readonly unknown[], InfiniteData<GetPostsResponse> | undefined]
  >;
  previousDetail?: IPost | undefined;
};

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onMutate: async (input: DeletePostInput): Promise<DeletePostContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.search("") });
      await queryClient.cancelQueries({
        queryKey: postKeys.detail(input.postId),
      });

      const previousFeeds = queryClient.getQueriesData<
        InfiniteData<GetPostsResponse>
      >({ queryKey: postKeys.search("") });
      const previousDetail = queryClient.getQueryData<IPost>(
        postKeys.detail(input.postId),
      );

      // Optimistic deletion: remove from list and detail immediately.
      previousFeeds.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          queryKey,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                posts: page.posts.filter((post) => post._id !== input.postId),
              })),
            };
          },
        );
      });

      queryClient.removeQueries({ queryKey: postKeys.detail(input.postId) });

      return { previousFeeds, previousDetail };
    },

    onError: (_error, input, context) => {
      if (context?.previousFeeds?.length) {
        context.previousFeeds.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          postKeys.detail(input.postId),
          context.previousDetail,
        );
      }
    },

    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.search(""),
        refetchType: "inactive",
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(input.postId),
      });
    },
  });
}
