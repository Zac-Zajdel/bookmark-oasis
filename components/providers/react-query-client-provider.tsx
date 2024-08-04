'use client';

import { OasisError } from '@/lib/oasisError';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { toast } from 'sonner';

function isOasisError(error: any): error is OasisError {
  return error instanceof OasisError;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const message = error?.message || 'An Unknown Error Occurred.';

      if (isOasisError(error)) {
        error.statusCode >= 500 ? toast.error(message) : toast.info(message);
      } else {
        toast.error(message);
      }
    },
  }),
});

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
