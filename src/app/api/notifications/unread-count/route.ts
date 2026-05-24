import { connectDB } from "@/db/connection";
import { Notification } from "@/db/models/notification.model";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const notification = await Notification.findOne({
    userId: session.user.id,
  }).lean();

  return NextResponse.json({
    count: notification?.unreadCount ?? 0,
  });
}
