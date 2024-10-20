import { OasisResponse } from '@/types/apiHelpers';
import { useMutation } from '@tanstack/react-query';

export const useCreateTokenMutation = () => {
  return useMutation({
    mutationFn: async (
      name: string,
    ): Promise<{ token: string; message: string }> => {
      const {
        success,
        message,
        data: token,
      }: OasisResponse<string> = await (
        await fetch('/api/tokens', {
          method: 'POST',
          body: JSON.stringify({
            name,
          }),
        })
      ).json();

      if (!success) throw new Error(message);

      return {
        token,
        message,
      };
    },
  });
};
