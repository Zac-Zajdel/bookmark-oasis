import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';

export const useCreateBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (bookmarkUrl: string) => {
      const {
        success,
        message,
        data: bookmark,
      }: OasisResponse<Bookmark> = await (
        await fetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            url: bookmarkUrl,
          }),
        })
      )?.json();

      if (!success) {
        throw new Error(message);
      }

      return {
        bookmark,
        message,
      };
    },
  });
};
