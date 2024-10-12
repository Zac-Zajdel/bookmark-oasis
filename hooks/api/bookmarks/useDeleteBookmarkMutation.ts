import { queryClient } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (bookmark: Partial<Bookmark>): Promise<void> => {
      const { success, message } = await (
        await fetch(`/api/bookmarks/${bookmark.id}`, {
          method: 'DELETE',
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
