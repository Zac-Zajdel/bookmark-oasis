'use client';

import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { formatDate } from '@/lib/utils';
import { ApiToken } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ApiTokenTableActions } from './api-token-table-actions';

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
      return <div className="w-36">{row.getValue('name')}</div>;
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
    cell: ({ row }) => {
      return <ApiTokenTableActions row={row} />;
    },
    enableSorting: false,
  },
];
