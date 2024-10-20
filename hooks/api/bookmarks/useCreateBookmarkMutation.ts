import { OasisResponse } from '@/types/apiHelpers';
import { CreateBookmarkParams } from '@/types/bookmarks';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';

export const useCreateBookmarkMutation = () => {
  return useMutation({
    mutationFn: async ({
      url,
      title,
      description,
      isManual,
    }: CreateBookmarkParams): Promise<{
      bookmark: Bookmark;
      message: string;
    }> => {
      let parameters: CreateBookmarkParams = {
        url,
      };

      if (isManual) {
        parameters = {
          ...parameters,
          title,
          description,
          isManual: true,
        };
      }

      const {
        success,
        message,
        data: bookmark,
      }: OasisResponse<Bookmark> = await (
        await fetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify(parameters),
        })
      )?.json();

      if (!success) throw new Error(message);

      return {
        bookmark,
        message,
      };
    },
  });
};
