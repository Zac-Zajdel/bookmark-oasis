import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type CreateFolderTagProps = {
  tagId?: string;
  folderId: string;
  tagName?: string;
  tagColor?: string;
};

export const useCreateFolderTagMutation = () => {
  return useMutation({
    mutationFn: async ({
      tagId,
      folderId,
      tagName,
      tagColor,
    }: CreateFolderTagProps) => {
      const { success, message, data }: OasisResponse<Tag> = await (
        await fetch(`/api/folders/${folderId}/tags`, {
          method: 'POST',
          body: JSON.stringify({
            tagId,
            tagName,
            tagColor,
          }),
        })
      ).json();

      if (!success) throw new Error(message);

      return {
        tag: data,
        message,
      };
    },
    onSuccess: async ({ message }: { tag: Tag; message: string }) => {
      toast.success(message);

      await queryClient.invalidateQueries({
        queryKey: ['tags'],
      });
    },
    onError: (error) => toast.error(error.message),
  });
};
