import { queryClient } from '@/lib/utils';
import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useDeleteApiTokenMutation() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { success, message }: OasisResponse = await (
        await fetch(`/api/tokens/${id}`, {
          method: 'DELETE',
        })
      ).json();

      !success ? toast.error(message) : toast.success(message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['apiTokens'],
      });
    },
  });
}
