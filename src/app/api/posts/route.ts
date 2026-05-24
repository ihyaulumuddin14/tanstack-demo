import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Utility for fake latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const viewerId = session?.user?.id ?? null;

  await connectDB();

  // Fake latency to make TanStack Query loading states observable
  await delay(1500);

  // Sort by newest first
  const posts = await Post.find().sort({
    createdAt: -1,
  });

  const normalizedPosts = posts.map((post) => {
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
    nextCursor: null, // Placeholder for cursor-based pagination
  });
}

export async function POST(req: Request) {
  // Extract user session for authorId
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
