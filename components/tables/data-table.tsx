'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  Table as TanStackTable,
} from '@tanstack/react-table';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> {
  table: TanStackTable<TData>;
  columns: ColumnDef<TData, any>[];
  isInitialLoad: boolean;
}

export function DataTable<TData>({
  table,
  columns,
  isInitialLoad = false,
}: DataTableProps<TData>) {
  return (
    <div>
      <div className="rounded-md border">
        {isInitialLoad ? (
          <div className="flex items-center justify-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-5 w-40" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-40" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-40" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-5 w-40" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="m-1 -ml-3 h-5 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="m-1 -ml-3 h-5 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="m-1 -ml-3 h-5 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="m-1 -ml-3 h-5 w-56" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
