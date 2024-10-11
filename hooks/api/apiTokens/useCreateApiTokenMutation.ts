import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateTokenMutation = () => {
  return useMutation({
    mutationFn: async (name: string) => {
      const { success, message, data }: OasisResponse<string> = await (
        await fetch('/api/tokens', {
          method: 'POST',
          body: JSON.stringify({
            name,
          }),
        })
      ).json();

      if (!success) throw toast.error(message);

      return {
        data,
        message,
      };
    },
  });
};
