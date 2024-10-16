'use client';

import { CreateTokenAction } from '@/components/apiTokens/create-token-action';
import { tokenTableColumns } from '@/components/apiTokens/token-table-columns';
import { DataTable } from '@/components/tables/data-table';
import { DataTableToolbar } from '@/components/tables/data-table-toolbar';
import { useApiTokensQuery } from '@/hooks/api/apiTokens/useApiTokensQuery';
import { useDataTable } from '@/hooks/useDataTable';
import { useTableSortingParams } from '@/hooks/useTableSortingParams';
import { ApiToken } from '@prisma/client';
import { Suspense, useEffect, useState } from 'react';

import IconShow from '@/components/icon-show';
import dynamic from 'next/dynamic';

// import EmojiPicker from '@/components/emoji-picker';
const EmojiPicker = dynamic(() => import('@/components/emoji-picker'), {
  ssr: false,
});

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

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleButtonClick = () => {
    setShowEmojiPicker(true);
  };

  return (
    <div className="container mt-10">
      {/* This is how I can render it using dynamic imports */}
      <div>
        <IconShow name="code" />
      </div>

      <div className="flex items-center justify-between pb-10">
        <DataTableToolbar
          placeholder="Search by name..."
          table={table}
        />
        <CreateTokenAction />
      </div>

      <button onClick={handleButtonClick}>Show Emoji Picker</button>

      <div className="mb-10 w-[50%]">
        {showEmojiPicker && (
          <Suspense fallback={<div>Loading Emoji Picker...</div>}>
            <EmojiPicker />
          </Suspense>
        )}
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
