import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (bookmarkUrl: string): Promise<void> => {
      const { success, message }: OasisResponse<{ bookmark: Bookmark }> =
        await (
          await fetch('/api/bookmarks', {
            method: 'POST',
            body: JSON.stringify({
              url: bookmarkUrl,
            }),
          })
        ).json();

      !success ? toast.error(message) : toast.success(message);
    },
  });
};
