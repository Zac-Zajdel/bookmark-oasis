'use client';

import { DataTable } from '@/components/tables/data-table';
import { DataTableToolbar } from '@/components/tables/data-table-toolbar';
import { TagActionDialog } from '@/components/tags/tag-action-dialog';
import { tagTableColumns } from '@/components/tags/tags-table-columns';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { useTagsQuery } from '@/hooks/api/tags/useTagsQuery';
import { useDataTable } from '@/hooks/useDataTable';
import { useTableSortingParams } from '@/hooks/useTableSortingParams';
import { Tag } from '@prisma/client';
import { TagIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TagsSettings() {
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { table, sorting, pageIndex, pageSize, globalFilter } =
    useDataTable<Tag>(tags, tagTableColumns, total);

  const { column, order } = useTableSortingParams(sorting);
  const { data } = useTagsQuery({
    table,
    column,
    order,
    pageSize,
    pageIndex,
    globalFilter,
  });

  useEffect(() => {
    if (data) {
      setTotal(data.total);
      setTags(data.data);
      setIsInitialLoad(false);
    }
  }, [data]);

  return (
    <div>
      <SectionHeader
        title="Tags"
        description="Manage your tags."
      >
        <TagActionDialog
          mode="Create"
          triggerChildren={
            <Button>
              <TagIcon className="mr-2 size-4" />
              Create
            </Button>
          }
        />
      </SectionHeader>

      <div className="pb-3">
        <DataTableToolbar
          placeholder="Search Tags..."
          table={table}
        />
      </div>

      <div className="divide-border mb-10 divide-y rounded-md">
        <div className="space-y-1">
          <DataTable
            table={table}
            columns={tagTableColumns}
            isInitialLoad={isInitialLoad}
          />
        </div>
      </div>
    </div>
  );
}
