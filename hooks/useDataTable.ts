import {
  ColumnDef,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

export function useDataTable<TData>(
  data: TData[],
  columns: ColumnDef<TData>[],
  total: number,
) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: false, // todo - true will reset pagination but we need to take care of pageIndex
    manualPagination: true,
    rowCount: total,
  });

  return {
    table,
    rowSelection,
    columnVisibility,
    sorting,
    globalFilter,
    pageSize: table.getState().pagination.pageSize,
    pageIndex: table.getState().pagination.pageIndex,
  };
}
