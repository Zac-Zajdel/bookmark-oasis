import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useBookmarksQuery = (
  debouncedSearch: string,
  page: number,
  itemsPerPage: number,
) => {
  const queryResult = useQuery({
    queryKey: ['bookmarks', debouncedSearch, page, itemsPerPage],
    queryFn: async (): Promise<{ bookmarks: Bookmark[]; total: number }> => {
      const {
        success,
        message,
        data,
      }: OasisResponse<{ bookmarks: Bookmark[]; total: number }> = await (
        await fetch(
          `/api/bookmarks?search=${debouncedSearch}&page=${page}&limit=${itemsPerPage}`,
        )
      ).json();

      if (!success) {
        throw toast.error(message);
      }

      return {
        bookmarks: data.bookmarks,
        total: data.total,
      };
    },
  });

  const { data, isLoading } = queryResult;

  return {
    bookmarks: data?.bookmarks || [],
    total: data?.total || 0,
    isLoading,
  };
};
