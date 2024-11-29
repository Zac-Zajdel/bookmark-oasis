'use client';

import { CreateTokenAction } from '@/components/apiTokens/create-token-action';
import { tokenTableColumns } from '@/components/apiTokens/token-table-columns';
import { DataTable } from '@/components/tables/data-table';
import { DataTableToolbar } from '@/components/tables/data-table-toolbar';
import { SectionHeader } from '@/components/ui/section-header';
import { useApiTokensQuery } from '@/hooks/api/apiTokens/useApiTokensQuery';
import { useDataTable } from '@/hooks/useDataTable';
import { useTableSortingParams } from '@/hooks/useTableSortingParams';
import { ApiToken } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function Settings() {
  const [total, setTotal] = useState(0);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { table, sorting, pageIndex, pageSize, globalFilter } =
    useDataTable<ApiToken>(apiTokens, tokenTableColumns, total);

  const { column, order } = useTableSortingParams(sorting);

  const { data: tokens } = useApiTokensQuery({
    table,
    column,
    order,
    pageSize,
    pageIndex,
    globalFilter,
  });

  useEffect(() => {
    if (tokens) {
      setTotal(tokens.total);
      setApiTokens(tokens.data);
      setIsInitialLoad(false);
    }
  }, [tokens]);

  return (
    <div className="container mt-10">
      <SectionHeader
        title="API Tokens"
        description="Query and obtain your data programmatically."
      >
        <CreateTokenAction />
      </SectionHeader>

      <div className="pb-3">
        <DataTableToolbar
          placeholder="Search Tokens..."
          table={table}
        />
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
