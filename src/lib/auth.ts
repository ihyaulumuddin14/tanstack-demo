import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { dbClient } from "@/lib/mongodb";
import type { Db } from "mongodb";

const isHttps = process.env.AUTH_URL?.startsWith("https://");

const createAuth = (db: Db) =>
  betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [process.env.AUTH_URL!],
    advanced: {
      useSecureCookies: isHttps,
    },
  });

type AuthInstance = ReturnType<typeof createAuth>;

let authPromise: Promise<AuthInstance> | undefined;

export function getAuth(): Promise<AuthInstance> {
  return (authPromise ??= (async () => {
    const client = await dbClient;
    const db = client.db();

    return createAuth(db);
  })());
}
