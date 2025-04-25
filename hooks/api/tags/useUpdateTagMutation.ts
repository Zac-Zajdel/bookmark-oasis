import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { Prisma, Tag } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateTagMutation = () => {
  return useMutation({
    mutationFn: async (
      tag: Partial<Prisma.TagUpdateInput>,
    ): Promise<{ tag: Tag; message: string }> => {
      const { success, message, data }: OasisResponse<Tag> = await (
        await fetch(`/api/tags/${tag.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: tag.name,
            color: tag.color,
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
