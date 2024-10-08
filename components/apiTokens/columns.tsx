'use client';

import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  },
  {
    accessorKey: 'lastUsed',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last Accessed"
      />
    ),
    cell: ({ row }) => {
      if (row.original.lastUsed) {
        const date = new Date(`${row.original.lastUsed}`);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        return <div className="flex justify-center">{formattedDate}</div>;
      }

      return <div className="flex justify-center">---</div>;
    },
  },
  {
    accessorKey: 'Actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
      />
    ),
    cell: () => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
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
