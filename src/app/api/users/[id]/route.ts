import { dbClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const client = await dbClient;
  const db = client.db();
  const users = db.collection("user");

  let user = await users.findOne({ id });
  if (!user) {
    if (ObjectId.isValid(id)) {
      user = await users.findOne({ _id: new ObjectId(id) });
    }
  }

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id ?? user._id?.toString?.() ?? id,
    name: user.name ?? null,
    email: user.email ?? null,
  });
}
