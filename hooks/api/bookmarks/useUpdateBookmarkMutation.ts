import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (bookmark: Partial<Bookmark>): Promise<void> => {
      const { success, message }: OasisResponse<{ bookmark: Bookmark }> =
        await (
          await fetch(`/api/bookmarks/${bookmark.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              url: bookmark.url,
              title: bookmark.title,
              isFavorite: bookmark.isFavorite,
              description: bookmark.description,
            }),
          })
        ).json();

      !success ? toast.error(message) : toast.success(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['bookmarks'],
      });
    },
  });
};
