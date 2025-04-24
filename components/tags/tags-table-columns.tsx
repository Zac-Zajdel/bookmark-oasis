'use client';

import { DataTableColumnHeader } from '@/components/tables/data-table-column-header';
import { TagBadge } from '@/components/tags/tag-badge';
import { TagTableAction } from '@/components/tags/tag-table-action';
import { formatDate } from '@/lib/utils';
import { Tag } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';

export const tagTableColumns: ColumnDef<Tag>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="w-72">
          <TagBadge tag={row.original} />
        </div>
      );
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
      return <TagTableAction row={row} />;
    },
    enableSorting: false,
  },
];
