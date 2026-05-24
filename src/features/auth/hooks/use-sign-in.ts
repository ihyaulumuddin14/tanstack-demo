import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

/**
 * Provides a signIn mutation for email/password authentication.
 * Uses TanStack Query useMutation for isPending and error state.
 *
 * Usage:
 *   const { mutate: signIn, isPending, error } = useSignIn();
 *   signIn({ email, password });
 */
export function useSignIn() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        throw new Error(result.error.message ?? "Failed to sign in.");
      }

      return result;
    },

    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });
}
