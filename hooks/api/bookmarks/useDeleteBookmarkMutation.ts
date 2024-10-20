import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteBookmarkMutation = () => {
  return useMutation({
    mutationFn: async (bookmark: Partial<Bookmark>): Promise<string> => {
      const { success, message }: OasisResponse = await (
        await fetch(`/api/bookmarks/${bookmark.id}`, {
          method: 'DELETE',
        })
      ).json();

      if (!success) throw new Error(message);

      return message;
    },
    onSuccess: async (message: string) => {
      toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ['bookmarks'],
      });
    },
    onError: (error) => toast.error(error.message),
  });
};
