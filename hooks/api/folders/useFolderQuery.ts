import { OasisResponse } from '@/types/apiHelpers';
import { Folder } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useFolderQuery = (id: string) => {
  return useQuery({
    queryKey: ['folder-details', id],
    queryFn: async (): Promise<Folder | undefined> => {
      const {
        success,
        message,
        data: folder,
      }: OasisResponse<Folder> = await (
        await fetch(`/api/folders/${id}`)
      ).json();

      if (!success) throw new Error(message);

      return folder;
    },
  });
};
