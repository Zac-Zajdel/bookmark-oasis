import { OasisError } from '@/lib/oasisError';
import { QueryCache, QueryClient } from '@tanstack/react-query';
import { type ClassValue, clsx } from 'clsx';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

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
        if (error.statusCode >= 500) toast.error(message);
        else toast.info(message);
      } else {
        toast.error(message);
      }
    },
  }),
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  input: string | number | Date,
  format: string = 'ddd, MMM D, YYYY h:mm A',
): string {
  const date: Dayjs = dayjs(input);
  return `${date.format(format)}`;
}

export function truncate(
  str: string,
  maxLength: number,
  extension: string | null = '...',
) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + (extension || '');
  }
  return str;
}

export function sleep(milliseconds: number): Promise<void> {
  console.log(`Sleeping for ${milliseconds} milliseconds...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
