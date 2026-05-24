import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const RANDOM_FAILURE_RATE = 0.3;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const delta = action === "like" ? 1 : -1;
  post.likes = Math.max(0, post.likes + delta);

  await post.save();

  return NextResponse.json({
    ...post.toObject(),
    likedByMe: action === "like",
  });
}
