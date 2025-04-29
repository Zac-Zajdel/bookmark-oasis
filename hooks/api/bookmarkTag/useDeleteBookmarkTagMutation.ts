import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type DeleteBookmarkTagMutationProps = {
  bookmarkId: string;
  tagId: string;
};

export function useDeleteBookmarkTagMutation() {
  return useMutation({
    mutationFn: async ({
      bookmarkId,
      tagId,
    }: DeleteBookmarkTagMutationProps): Promise<string> => {
      const { success, message }: OasisResponse = await (
        await fetch(`/api/bookmarks/${bookmarkId}/tags`, {
          method: 'DELETE',
          body: JSON.stringify({
            tagId,
          }),
        })
      ).json();

      if (!success) throw new Error(message);

      return message;
    },
    onSuccess: async (message: string) => {
      toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => toast.error(error.message),
  });
}
