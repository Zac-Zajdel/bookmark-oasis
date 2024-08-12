import { OasisError } from '@/lib/oasisError';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const message = error?.message || 'An Unknown Error Occurred.';

      if (error instanceof OasisError) {
        error.statusCode >= 500 ? toast.error(message) : toast.info(message);
      } else {
        toast.error(message);
      }
    },
  }),
});
