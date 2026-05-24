import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

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
