import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useBookmarksQuery = (
  debouncedSearch: string,
  page: number,
  itemsPerPage: number,
) => {
  const { data, isLoading } = useQuery({
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

      if (!success) throw new Error(message);

      return {
        bookmarks: data.bookmarks,
        total: data.total,
      };
    },
  });

  const total = data?.total || 0;
  const bookmarks = data?.bookmarks || [];
  const totalPages = bookmarks ? Math.ceil(total / itemsPerPage) : 1;

  return {
    total,
    bookmarks,
    isLoading,
    totalPages,
  };
};
