"use client";

import { usePosts } from "@/features/posts/hooks/use-posts";
import { useLikePost } from "@/features/posts/hooks/use-like-post";

export default function HomePage() {
  const { data, isLoading } = usePosts();

  const likeMutation = useLikePost();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>Feed</h1>

      {data?.map((post: any) => (
        <div
          key={post._id}
          style={{
            border: "1px solid gray",
            padding: 12,
            marginBottom: 12,
          }}
        >
          <p>{post.content}</p>

          <p>❤️ {post.likes}</p>

          <button onClick={() => likeMutation.mutate(post._id)}>Like</button>
        </div>
      ))}
    </div>
  );
}
