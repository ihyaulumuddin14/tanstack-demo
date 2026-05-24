import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { initNotifications } from "@/features/notifications/api/init-notifications";

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

    onSuccess: async () => {
      // Initialize server-side notification state after registration.
      // Polling needs persisted server state (not just optimistic cache).
      try {
        await initNotifications();
      } catch {
        // Keep signup flow resilient; polling can recover on next session.
      }
      router.push("/");
      router.refresh();
    },
  });
}
