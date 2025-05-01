import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type DeleteFolderTagProps = {
  folderId: string;
  tagId: string;
};

export function useDeleteFolderTagMutation() {
  return useMutation({
    mutationFn: async ({
      folderId,
      tagId,
    }: DeleteFolderTagProps): Promise<string> => {
      const { success, message }: OasisResponse = await (
        await fetch(`/api/folders/${folderId}/tags`, {
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
