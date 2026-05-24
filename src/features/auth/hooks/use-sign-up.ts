import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

/**
 * Provides a signUp mutation for email/password registration.
 * Uses TanStack Query useMutation for isPending and error state.
 *
 * Usage:
 *   const { mutate: signUp, isPending, error } = useSignUp();
 *   signUp({ name, email, password });
 */
export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const result = await authClient.signUp.email({ name, email, password });

      if (result.error) {
        throw new Error(result.error.message ?? "Failed to create account.");
      }

      return result;
    },

    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });
}
