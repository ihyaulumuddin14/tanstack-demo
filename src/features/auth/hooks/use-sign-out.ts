import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Provides a signOut function to end the current session.
 *
 * Usage:
 *   const { signOut, isPending } = useSignOut();
 *   await signOut();
 */
export function useSignOut() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await authClient.signOut();
    setIsPending(false);
    router.push("/sign-in");
    router.refresh();
  }

  return { signOut, isPending };
}
