import { authClient } from "@/lib/auth-client";

/**
 * Returns the current session and user info reactively.
 *
 * Usage:
 *   const { user, session, isPending } = useSession();
 */
export function useSession() {
  const { data, isPending, error } = authClient.useSession();

  return {
    session: data?.session ?? null,
    user: data?.user ?? null,
    isPending,
    error,
  };
}
