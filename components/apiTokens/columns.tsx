'use client';

import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { ApiToken } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Trash2 } from 'lucide-react';

// TODO - Should I memoize this?
export const columns: ColumnDef<ApiToken>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => {
      return <div className="w-32">{row.getValue('name')}</div>;
    },
  },
  {
    accessorKey: 'lastUsed',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last Used"
      />
    ),
    cell: ({ row }) => {
      if (row.getValue('lastUsed')) {
        return <div>{formatDate(row.getValue('lastUsed'), 'MMM D, YYYY')}</div>;
      }

      return '---';
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created"
      />
    ),
    cell: ({ row }) => {
      if (row.getValue('createdAt')) {
        return (
          <div>{formatDate(row.getValue('createdAt'), 'MMM D, YYYY')}</div>
        );
      }

      return '---';
    },
  },
  {
    meta: 'Actions',
    id: 'actions',
    cell: () => {
      return (
        <div className="flex items-center justify-end pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="size-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Trash2 className="mr-2 size-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];
