import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

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
