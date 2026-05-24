import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost, type UpdatePostInput } from "../api/update-post";
import { postKeys } from "../lib/query-keys";
import type { GetPostsResponse } from "../api/get-posts";
import type { IPost } from "../types";

type EditPostContext = {
  previousFeeds?: Array<
    [readonly unknown[], InfiniteData<GetPostsResponse> | undefined]
  >;
  previousDetail?: IPost | undefined;
};

export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

    onMutate: async (input: UpdatePostInput): Promise<EditPostContext> => {
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

      const applyUpdate = (post: IPost) => ({
        ...post,
        content: input.content,
        updatedAt: new Date().toISOString(),
      });

      // Manual cache manipulation keeps the list and detail in sync immediately.
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
                  post._id === input.postId ? applyUpdate(post) : post,
                ),
              })),
            };
          },
        );
      });

      if (previousDetail) {
        queryClient.setQueryData(
          postKeys.detail(input.postId),
          applyUpdate(previousDetail),
        );
      }

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

    onSuccess: (updatedPost) => {
      queryClient.setQueryData(postKeys.detail(updatedPost._id), updatedPost);
    },

    onSettled: (_data, _error, input) => {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(input.postId),
      });
      queryClient.invalidateQueries({
        queryKey: postKeys.search(""),
        refetchType: "inactive",
      });
    },
  });
}
