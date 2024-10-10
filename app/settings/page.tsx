'use client';

import { CreateTokenAction } from '@/components/apiTokens/create-token-action';
import { tokenTableColumns } from '@/components/apiTokens/token-table-columns';
import { DataTable } from '@/components/tables/data-table';
import { DataTableToolbar } from '@/components/tables/data-table-toolbar';
import { useDataTable } from '@/hooks/useDataTable';
import { useTableSortingParams } from '@/hooks/useTableSortingParams';
import { OasisResponse } from '@/types/apiHelpers';
import { ApiToken } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Settings() {
  const [total, setTotal] = useState(0);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { table, sorting, pageIndex, pageSize, globalFilter } =
    useDataTable<ApiToken>(apiTokens, tokenTableColumns, total);

  const { column, order } = useTableSortingParams(sorting);

  useQuery({
    queryKey: [
      'apiTokens',
      column,
      order,
      pageSize,
      globalFilter,
      pageIndex + 1,
    ],
    queryFn: async (): Promise<ApiToken[]> => {
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
        toast.error(message);
        return [];
      }

      setTotal(data.total);
      setApiTokens(data.apiTokens);
      setIsInitialLoad(false);

      return data.apiTokens;
    },
  });

  return (
    <div className="container mt-10">
      <div className="flex items-center justify-between pb-10">
        <DataTableToolbar
          placeholder="Search by name..."
          table={table}
        />
        <CreateTokenAction />
      </div>

      <div className="mb-12 divide-y divide-border rounded-md">
        <div className="space-y-1">
          <DataTable
            table={table}
            columns={tokenTableColumns}
            isInitialLoad={isInitialLoad}
          />
        </div>
      </div>
    </div>
  );
}
