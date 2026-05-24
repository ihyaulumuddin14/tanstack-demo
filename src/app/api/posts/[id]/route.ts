import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const viewerId = session?.user?.id ?? null;

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  await connectDB();
  await delay(800);

  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const plain = post.toObject();
  const likedBy = (plain.likedBy ?? []).map(
    (likeId: { toString?: () => string }) =>
      likeId?.toString?.() ?? String(likeId),
  );
  const likedByMe = viewerId ? likedBy.includes(viewerId) : false;

  return NextResponse.json({
    ...plain,
    _id: plain._id?.toString?.() ?? plain._id,
    authorId: plain.authorId?.toString?.() ?? plain.authorId,
    likedBy,
    likesCount: plain.likesCount ?? likedBy.length ?? 0,
    likedByMe,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json(
      { message: "Content is required" },
      { status: 400 },
    );
  }

  await connectDB();
  await delay(800);

  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (post.authorId?.toString?.() !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  post.content = content;
  await post.save();

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
    likedByMe: likedBy.includes(session.user.id),
  });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
  }

  await connectDB();
  await delay(800);

  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (post.authorId?.toString?.() !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await post.deleteOne();

  return NextResponse.json({ ok: true });
}
