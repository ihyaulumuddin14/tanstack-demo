import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const posts = await Post.find().sort({
    createdAt: -1,
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const post = await Post.create({
    content: body.content,
  });

  return NextResponse.json(post);
}
