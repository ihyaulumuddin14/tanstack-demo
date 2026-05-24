import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api/get-user-by-id";
import { userKeys } from "../lib/query-keys";

export function useUserById(userId?: string) {
  return useQuery({
    queryKey: userKeys.detail(userId ?? "unknown"),
    queryFn: () => getUserById(userId ?? ""),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });
}
