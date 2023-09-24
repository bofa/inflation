import { QueryClient, QueryKey } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export function invalidateQuery(queryKey: QueryKey) {
  return queryClient.invalidateQueries({ queryKey })
}