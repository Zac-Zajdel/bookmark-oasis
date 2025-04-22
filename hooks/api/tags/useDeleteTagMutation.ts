import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteTagMutation() {
  return useMutation({
    mutationFn: async (id: string): Promise<string> => {
      const { success, message }: OasisResponse = await (
        await fetch(`/api/tags/${id}`, {
          method: 'DELETE',
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
