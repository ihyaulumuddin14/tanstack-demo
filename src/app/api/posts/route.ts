import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

// Utility for fake latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PAGE_SIZE = 5;

export async function GET(req: Request) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const viewerId = session?.user?.id ?? null;

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limitParam = Number(searchParams.get("limit"));
  const searchQuery = searchParams.get("query")?.trim();
  const limit =
    Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(limitParam, 20)
      : PAGE_SIZE;

  await connectDB();

  // Fake latency to make TanStack Query loading states observable
  await delay(1500);

  const query: Record<string, unknown> = {};

  if (searchQuery) {
    query.content = { $regex: searchQuery, $options: "i" };
  }

  if (cursor && ObjectId.isValid(cursor)) {
    query._id = { $lt: new ObjectId(cursor) };
  }

  // Cursor pagination: fetch one extra to determine the next cursor.
  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasMore = posts.length > limit;
  const pagePosts = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore
    ? (pagePosts[pagePosts.length - 1]?._id?.toString?.() ?? null)
    : null;

  const normalizedPosts = pagePosts.map((post) => {
    const plain = post.toObject();
    const likedBy = (plain.likedBy ?? []).map(
      (likeId: { toString?: () => string }) =>
        likeId?.toString?.() ?? String(likeId),
    );
    const likedByMe = viewerId ? likedBy.includes(viewerId) : false;

    return {
      ...plain,
      _id: plain._id?.toString?.() ?? plain._id,
      authorId: plain.authorId?.toString?.() ?? plain.authorId,
      likedBy,
      likesCount: plain.likesCount ?? likedBy.length ?? 0,
      likedByMe,
    };
  });

  // Return shape structured for future infinite query pagination
  return NextResponse.json({
    posts: normalizedPosts,
    nextCursor,
  });
}

export async function POST(req: Request) {
  // Extract user session for authorId
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  // Fake latency to make TanStack Query loading states observable
  await delay(1500);

  const body = await req.json();

  if (!body.content) {
    return NextResponse.json(
      { message: "Content is required" },
      { status: 400 },
    );
  }

  const post = await Post.create({
    content: body.content,
    authorId: session.user.id,
  });

  const plain = post.toObject();
  const likedBy = (plain.likedBy ?? []).map(
    (likeId: { toString?: () => string }) =>
      likeId?.toString?.() ?? String(likeId),
  );

  return NextResponse.json({
    ...plain,
    _id: plain._id?.toString?.() ?? plain._id,
    authorId: plain.authorId?.toString?.() ?? plain.authorId,
    likedBy,
    likesCount: plain.likesCount ?? likedBy.length ?? 0,
    likedByMe: false,
  });
}
