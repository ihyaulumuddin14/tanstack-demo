import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  await connectDB();

  const post = await Post.findById(params.id);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  post.likes += 1;

  await post.save();

  return NextResponse.json(post);
}
