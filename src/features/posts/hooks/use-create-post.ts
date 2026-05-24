import type { InfiniteData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, type CreatePostInput } from "../api/create-post";
import { postKeys } from "../lib/query-keys";
import type { GetPostsResponse } from "../api/get-posts";
import type { IPost } from "../types";

type CreatePostContext = {
  previousFeeds?: Array<[readonly unknown[], InfiniteData<GetPostsResponse> | undefined]>;
  optimisticId: string;
};

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,

    onMutate: async (input: CreatePostInput): Promise<CreatePostContext> => {
      await queryClient.cancelQueries({ queryKey: postKeys.search("") });

      const previousFeeds = queryClient.getQueriesData<
        InfiniteData<GetPostsResponse>
      >({ queryKey: postKeys.search("") });

      const optimisticPost: IPost = {
        _id: `optimistic-${Date.now()}`,
        content: input.content,
        likesCount: 0,
        likedBy: [],
        authorId: "me",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likedByMe: false,
      };

      // Manual cache manipulation: insert immediately for an instant UI update.
      const searchQueries = queryClient.getQueriesData<
        InfiniteData<GetPostsResponse>
      >({ queryKey: postKeys.search("") });

      searchQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          queryKey,
          (old) => {
            if (!old) {
              return {
                pages: [{ posts: [optimisticPost], nextCursor: null }],
                pageParams: [null],
              };
            }

            const [firstPage, ...restPages] = old.pages;

            const updatedFirstPage = firstPage
              ? {
                  ...firstPage,
                  posts: [optimisticPost, ...firstPage.posts],
                }
              : { posts: [optimisticPost], nextCursor: null };

            return {
              ...old,
              pages: [updatedFirstPage, ...restPages],
            };
          },
        );
      });

      return { previousFeeds, optimisticId: optimisticPost._id };
    },

    onError: (_error, _input, context) => {
      if (context?.previousFeeds?.length) {
        context.previousFeeds.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
        return;
      }

      queryClient.removeQueries({ queryKey: postKeys.search("") });
    },

    onSuccess: (createdPost, _input, context) => {
      // Cache synchronization: swap optimistic post for the server-confirmed one.
      const searchQueries = queryClient.getQueriesData<
        InfiniteData<GetPostsResponse>
      >({ queryKey: postKeys.search("") });

      searchQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          queryKey,
          (old) => {
            if (!old) {
              return {
                pages: [{ posts: [createdPost], nextCursor: null }],
                pageParams: [null],
              };
            }

            const pages = old.pages.map((page) => {
              const hasOptimistic = page.posts.some(
                (post) => post._id === context?.optimisticId,
              );

              if (!hasOptimistic) return page;

              return {
                ...page,
                posts: page.posts.map((post) =>
                  post._id === context?.optimisticId ? createdPost : post,
                ),
              };
            });

            const hasAnyOptimistic = pages.some((page) =>
              page.posts.some((post) => post._id === createdPost._id),
            );

            return hasAnyOptimistic
              ? { ...old, pages }
              : {
                  ...old,
                  pages: [
                    {
                      ...pages[0],
                      posts: [createdPost, ...(pages[0]?.posts ?? [])],
                    },
                    ...pages.slice(1),
                  ],
                };
          },
        );
      });
    },

    onSettled: () => {
      // Invalidate inactive feeds to keep data fresh without refetching live UI.
      queryClient.invalidateQueries({
        queryKey: postKeys.search(""),
        refetchType: "inactive",
      });
    },
  });
}
