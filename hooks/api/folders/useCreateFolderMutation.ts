import { OasisResponse } from '@/types/apiHelpers';
import { CreateFolderParams } from '@/types/folders';
import { Folder } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';

export const useCreateFolderMutation = () => {
  return useMutation({
    mutationFn: async ({
      title,
      description,
    }: CreateFolderParams): Promise<{
      folder: Folder;
      message: string;
    }> => {
      const parameters: CreateFolderParams = {
        title,
        description,
      };

      const {
        success,
        message,
        data: folder,
      }: OasisResponse<Folder> = await (
        await fetch('/api/folders', {
          method: 'POST',
          body: JSON.stringify(parameters),
        })
      )?.json();

      if (!success) throw new Error(message);

      return {
        folder,
        message,
      };
    },
  });
};
