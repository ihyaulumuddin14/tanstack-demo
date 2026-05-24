'use client'

import { queryClient } from '@/lib/tanstack/query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools/production'
import { ReactNode } from 'react'

export default function TanstackProviders({
  children
}: {
  children: ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
