import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Folder } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateFolderMutation = () => {
  return useMutation({
    mutationFn: async (
      folder: Folder,
    ): Promise<{ folder: Folder; message: string }> => {
      const { success, message, data }: OasisResponse<Folder> = await (
        await fetch(`/api/folders/${folder.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: folder.title,
            isFavorite: folder.isFavorite,
            description: folder.description,
            iconName: folder.iconName,
          }),
        })
      ).json();

      if (!success) throw new Error(message);

      return {
        folder: data,
        message,
      };
    },
    onSuccess: async ({ message }: { message: string }) => {
      toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ['folders'],
      });
    },
    onError: (error) => toast.error(error.message),
  });
};
