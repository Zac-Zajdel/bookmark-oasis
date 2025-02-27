import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Folder } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteFolderMutation = () => {
  return useMutation({
    mutationFn: async (folder: Folder): Promise<string> => {
      const { success, message }: OasisResponse = await (
        await fetch(`/api/folders/${folder.id}`, {
          method: 'DELETE',
        })
      ).json();

      if (!success) throw new Error(message);

      return message;
    },
    onSuccess: async (message: string) => {
      toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ['folders'],
      });
    },
    onError: (error) => toast.error(error.message),
  });
};
