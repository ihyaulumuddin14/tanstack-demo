import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

/**
 * Provides a signUp function for email/password registration.
 *
 * Usage:
 *   const { signUp, isPending, error } = useSignUp();
 *   await signUp({ name, email, password });
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
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    },

    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  // const [isPending, setIsPending] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // async function signUp({
  //   name,
  //   email,
  //   password,
  // }: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }) {
  //   setIsPending(true);
  //   setError(null);

  //   const { error: authError } = await authClient.signUp.email({
  //     name,
  //     email,
  //     password,
  //   });

  //   setIsPending(false);

  //   if (authError) {
  //     setError(authError.message ?? "Failed to create account. Please try again.");
  //     return;
  //   }

  //   router.push("/");
  //   router.refresh();
  // }

  // return { signUp, isPending, error };
}
