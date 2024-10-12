import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

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

      if (!success) {
        throw toast.error(message);
      }

      return bookmark;
    },
  });
};
