import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbClient } from "@/lib/mongodb";

const client = await dbClient;
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
});
