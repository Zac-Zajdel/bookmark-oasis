import { OasisResponse } from '@/types/apiHelpers';
import { Folder } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useFoldersQuery = (
  debouncedSearch: string,
  page: number,
  itemsPerPage: number,
) => {
  const queryResult = useQuery({
    queryKey: ['folders', debouncedSearch, page, itemsPerPage],
    queryFn: async (): Promise<{ folders: Folder[]; total: number }> => {
      const {
        success,
        message,
        data,
      }: OasisResponse<{ folders: Folder[]; total: number }> = await (
        await fetch(
          `/api/folders?search=${debouncedSearch}&page=${page}&limit=${itemsPerPage}`,
        )
      ).json();

      if (!success) throw new Error(message);

      return {
        folders: data.folders,
        total: data.total,
      };
    },
  });

  const { data, isLoading } = queryResult;

  return {
    folders: data?.folders || [],
    total: data?.total || 0,
    isLoading,
  };
};
