import { PostDetailPage } from "@/features/posts/components/post-detail-page";

export default async function PostDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <PostDetailPage postId={id} />
    </div>
  );
}
