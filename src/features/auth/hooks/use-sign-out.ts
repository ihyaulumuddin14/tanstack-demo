import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

/**
 * Provides a signOut mutation to end the current session.
 * Uses TanStack Query useMutation for isPending state.
 *
 * Usage:
 *   const { mutate: signOut, isPending } = useSignOut();
 *   signOut();
 */
export function useSignOut() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message ?? "Failed to sign out.");
      }

      return result;
    },

    onSuccess: () => {
      router.push("/sign-in");
      router.refresh();
    },
  });
}
