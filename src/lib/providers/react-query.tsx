"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { AppwriteException } from "appwrite";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

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
        mutations: {
          onError: (error) => {
            if (error instanceof AppwriteException) {
              console.log("should be instance of appwrite error");
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }

            if (error instanceof Error) {
              toast({
                description: error.message,
                variant: "destructive",
              });
            }

            console.error(error);
          },
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
