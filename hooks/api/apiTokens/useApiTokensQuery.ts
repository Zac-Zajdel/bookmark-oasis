import { OasisResponse } from '@/types/apiHelpers';
import { ApiToken } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { toast } from 'sonner';

interface UseApiTokensQueryParams {
  table: Table<ApiToken>;
  column: string | undefined;
  order: 'asc' | 'desc';
  pageSize: number;
  pageIndex: number;
  globalFilter: string | undefined;
}

export const useApiTokensQuery = ({
  table,
  column,
  order,
  pageIndex,
  pageSize,
  globalFilter,
}: UseApiTokensQueryParams) =>
  useQuery({
    queryKey: [
      'apiTokens',
      column,
      order,
      pageSize,
      globalFilter,
      pageIndex + 1,
    ],
    queryFn: async (): Promise<{ data: ApiToken[]; total: number }> => {
      // Reset page index when adjusting filters
      if (globalFilter?.trim()?.length) {
        table.setPageIndex(0);
      }

      const queryParams = new URLSearchParams({
        page: String(pageIndex + 1),
        limit: String(pageSize),
      });

      if (column && order) {
        queryParams.append('column', column);
        queryParams.append('order', order);
      }

      if (globalFilter?.trim()?.length) {
        queryParams.append('search', globalFilter);
      }

      const {
        success,
        message,
        data,
      }: OasisResponse<{ apiTokens: ApiToken[]; total: number }> = await (
        await fetch(`/api/tokens?${queryParams.toString()}`)
      ).json();

      if (!success) {
        throw toast.error(message);
      }

      return {
        data: data.apiTokens,
        total: data.total,
      };
    },
  });
