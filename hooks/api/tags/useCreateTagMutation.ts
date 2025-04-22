import { OasisResponse } from '@/types/apiHelpers';
import { Prisma, Tag } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateTagMutation = () => {
  return useMutation({
    mutationFn: async ({
      tag,
      bookmarkId,
      folderId,
    }: {
      tag: Partial<Prisma.TagCreateInput>;
      bookmarkId?: string;
      folderId?: string;
    }) => {
      const { success, message, data }: OasisResponse<Tag> = await (
        await fetch('/api/tags', {
          method: 'POST',
          body: JSON.stringify({
            name: tag?.name,
            color: tag?.color,
            bookmarkId,
            folderId,
          }),
        })
      ).json();

      if (!success) throw new Error(message);

      return {
        tag: data,
        message,
      };
    },
    onError: (error) => toast.error(error.message),
  });
};
