import { connectDB } from "@/db/connection";
import { Post } from "@/db/models/post.model";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Utility for fake latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await connectDB();
  
  // Fake latency to make TanStack Query loading states observable
  await delay(1500);

  // Sort by newest first
  const posts = await Post.find().sort({
    createdAt: -1,
  });

  // Return shape structured for future infinite query pagination
  return NextResponse.json({
    posts,
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
    return NextResponse.json({ message: "Content is required" }, { status: 400 });
  }

  const post = await Post.create({
    content: body.content,
    authorId: session.user.id,
  });

  return NextResponse.json(post);
}
