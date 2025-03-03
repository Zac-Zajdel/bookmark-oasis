import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useBookmarksQuery = (
  debouncedSearch: string,
  page: number,
  itemsPerPage: number,
  folderId?: string,
) => {
  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks', debouncedSearch, page, itemsPerPage, folderId],
    queryFn: async (): Promise<{ bookmarks: Bookmark[]; total: number }> => {
      const url = new URL(`/api/bookmarks`, window.location.origin);
      url.searchParams.append('search', debouncedSearch);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', itemsPerPage.toString());

      // Append folderId only if it exists
      if (folderId) url.searchParams.append('folderId', folderId);

      const {
        success,
        message,
        data,
      }: OasisResponse<{ bookmarks: Bookmark[]; total: number }> = await (
        await fetch(url.toString())
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
