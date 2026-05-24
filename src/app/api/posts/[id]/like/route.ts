import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;
  const post = await Post.findById(id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  post.likes += 1;

  await post.save();

  return NextResponse.json(post);
}
