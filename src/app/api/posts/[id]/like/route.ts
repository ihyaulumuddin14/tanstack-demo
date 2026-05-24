import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { getAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Types } from "mongoose";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const RANDOM_FAILURE_RATE = 0.3;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const action = body?.action === "unlike" ? "unlike" : "like";
  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  await delay(700);

  if (Math.random() < RANDOM_FAILURE_RATE) {
    return NextResponse.json(
      { message: "Random failure for workshop demo" },
      { status: 500 },
    );
  }

  const viewerId = session.user.id;
  const viewerObjectId = new ObjectId(viewerId);
  const likedBy = (post.likedBy ?? []) as Types.ObjectId[];
  const alreadyLiked = likedBy.some((likeId) => likeId.toString() === viewerId);

  if (action === "like" && !alreadyLiked) {
    post.likedBy = [...likedBy, viewerObjectId];
    post.likesCount = (post.likesCount ?? 0) + 1;
  }

  if (action === "unlike" && alreadyLiked) {
    post.likedBy = likedBy.filter((likeId) => likeId.toString() !== viewerId);
    post.likesCount = Math.max(0, (post.likesCount ?? 0) - 1);
  }

  await post.save();

  const plain = post.toObject();
  const likedByResult = (plain.likedBy ?? []).map(
    (likeId: { toString?: () => string }) =>
      likeId?.toString?.() ?? String(likeId),
  );
  const likedByMe = likedByResult.includes(viewerId);

  return NextResponse.json({
    ...plain,
    _id: plain._id?.toString?.() ?? plain._id,
    authorId: plain.authorId?.toString?.() ?? plain.authorId,
    likedBy: likedByResult,
    likesCount: plain.likesCount ?? likedByResult.length ?? 0,
    likedByMe,
  });
}
