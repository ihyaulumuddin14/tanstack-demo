import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { postKeys } from "../lib/query-keys";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await axios.patch(`/api/posts/${postId}/like`);

      return res.data;
    },

    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: postKeys.all,
      });

      const previousPosts = queryClient.getQueryData(postKeys.all);

      queryClient.setQueryData(postKeys.all, (old: any[]) => {
        return old.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likes: post.likes + 1,
            };
          }

          return post;
        });
      });

      return { previousPosts };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData(postKeys.all, context?.previousPosts);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
    },
  });
}
