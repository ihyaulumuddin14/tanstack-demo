import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

/**
 * Provides a signIn function for email/password authentication.
 *
 * Usage:
 *   const { signIn, isPending, error } = useSignIn();
 *   await signIn({ email, password });
 */
export function useSignIn() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    setIsPending(true);
    setError(null);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    setIsPending(false);

    if (authError) {
      setError(authError.message ?? "Failed to sign in. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return { signIn, isPending, error };
}
