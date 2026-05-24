import { connectDB } from "@/db/connection";
import { Notification } from "@/db/models/notification.model";
import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  // Persist server state so polling reflects real data across sessions.
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const existing = await Notification.findOne({
    userId: session.user.id,
  }).lean();

  if (existing) {
    return NextResponse.json({ initialized: false });
  }

  await Notification.create({
    userId: session.user.id,
    unreadCount: 0,
  });

  return NextResponse.json({ initialized: true });
}
