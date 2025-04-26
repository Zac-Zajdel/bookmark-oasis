import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';

interface UseTagsQueryParams {
  table?: Table<Tag>;
  column: string | undefined;
  order: 'asc' | 'desc';
  pageSize: number;
  pageIndex: number;
  globalFilter: string | undefined;
  enabled?: boolean;
}

export const useTagsQuery = ({
  table,
  column,
  order,
  pageIndex,
  pageSize,
  globalFilter,
  enabled = true,
}: UseTagsQueryParams) =>
  useQuery({
    queryKey: ['tags', column, order, pageSize, globalFilter, pageIndex + 1],
    queryFn: async (): Promise<{ data: Tag[]; total: number }> => {
      // Reset page index when adjusting filters
      if (globalFilter?.trim()?.length) {
        table?.setPageIndex(0);
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
      }: OasisResponse<{ tags: Tag[]; total: number }> = await (
        await fetch(`/api/tags?${queryParams.toString()}`)
      ).json();

      if (!success) throw new Error(message);

      return {
        data: data.tags,
        total: data.total,
      };
    },
    enabled,
  });
