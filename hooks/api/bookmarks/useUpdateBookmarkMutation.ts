import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (bookmark: Partial<Bookmark>) => {
      const { success, message, data }: OasisResponse<Bookmark> = await (
        await fetch(`/api/bookmarks/${bookmark.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            url: bookmark.url,
            title: bookmark.title,
            isFavorite: bookmark.isFavorite,
            description: bookmark.description,
            iconName: bookmark.iconName,
          }),
        })
      ).json();

      !success ? toast.error(message) : toast.success(message);

      return {
        bookmark: data,
        message,
      };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['bookmarks'],
      });
    },
  });
};
