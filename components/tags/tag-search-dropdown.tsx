'use client';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useTagsQuery } from '@/hooks/api/tags/useTagsQuery';
import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function TagSearchDropdown() {
  const [tags, setTags] = useState<Option[]>([]);

  const { data } = useTagsQuery({
    column: 'name',
    order: 'asc',
    pageSize: 10,
    pageIndex: 0,
    globalFilter: '',
  });

  async function searchForTags(value: string) {
    const queryParams = new URLSearchParams({
      page: String(1),
      limit: String(10),
      column: 'name',
      order: 'asc',
      search: value,
    });

    const { data }: OasisResponse<{ tags: Tag[]; total: number }> = await (
      await fetch(`/api/tags?${queryParams.toString()}`)
    ).json();

    return data.tags.map((t) => ({
      label: t.name,
      value: t.id,
    }));
  }

  useEffect(() => {
    if (data) {
      setTags(
        data.data.map((t) => ({
          label: t.name,
          value: t.id,
        })),
      );
    }
  }, [data]);

  return (
    <MultipleSelector
      defaultOptions={tags}
      onChange={(value) => {
        console.log(value);
      }}
      onSearch={async (value) => await searchForTags(value)}
      hidePlaceholderWhenSelected
      triggerSearchOnFocus
      placeholder="Search Tags..."
      creatable
      hideClearAllButton
      loadingIndicator={
        <p className="text-muted-foreground py-2 text-center text-sm leading-10">
          Loading...
        </p>
      }
      emptyIndicator={
        <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
          No Results Found.
        </p>
      }
    />
  );
}
