import { useQuery } from "@tanstack/react-query"
import { getHealth, HealthResponse } from "@/lib/api"

export function useApiHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 60000, // Refetch every 60 seconds (reduced frequency)
    retry: 2, // Increased retry count
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}
