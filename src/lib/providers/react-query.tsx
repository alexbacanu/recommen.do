"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { useState } from "react";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          // staleTime: 1000 * 60 * 1, // 1 minute
          cacheTime: 1000 * 60 * 60 * 1, // 1 hour
          // refetchOnMount: false,
          // refetchOnReconnect: false,
          // refetchOnWindowFocus: false,
        },
      },
    });

    if (typeof window !== "undefined") {
      const persister = createSyncStoragePersister({ storage: localStorage });
      persistQueryClient({ queryClient: client, persister });
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
