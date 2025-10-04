import { useQuery } from "@tanstack/react-query"
import { getHealth, HealthResponse } from "@/lib/api"

export function useApiHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 1,
    staleTime: 10000, // Consider data stale after 10 seconds
  })
}
