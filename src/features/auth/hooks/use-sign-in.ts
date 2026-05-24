import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

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
