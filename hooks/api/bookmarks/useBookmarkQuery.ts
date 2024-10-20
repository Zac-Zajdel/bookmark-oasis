import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useBookmarkQuery = (id: string) => {
  return useQuery({
    queryKey: ['bookmark-details', id],
    queryFn: async (): Promise<Bookmark | undefined> => {
      const {
        success,
        message,
        data: bookmark,
      }: OasisResponse<Bookmark> = await (
        await fetch(`/api/bookmarks/${id}`)
      ).json();

      if (!success) throw new Error(message);

      return bookmark;
    },
  });
};
