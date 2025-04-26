'use client';

import MultipleSelector from '@/components/ui/multiple-selector';
import { useTagsQuery } from '@/hooks/api/tags/useTagsQuery';
import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';

export default function TagSearchDropdown() {
  const { data: initialTagData } = useTagsQuery({
    pageSize: 10,
    pageIndex: 0,
    column: 'name',
    order: 'asc',
    globalFilter: '',
  });

  // Mutation for search
  const searchMutation = useMutation({
    mutationFn: async (searchTerm: string) => {
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '10',
        column: 'name',
        order: 'asc',
        search: searchTerm,
      });

      const { data }: OasisResponse<{ tags: Tag[]; total: number }> = await (
        await fetch(`/api/tags?${queryParams.toString()}`)
      ).json();

      return data.tags.map((t) => ({
        label: t.name,
        value: t.name,
      }));
    },
  });

  const mapTagsToOptions = (tags: Tag[]) => {
    return (
      tags?.map((t: Tag) => ({
        label: t.name,
        value: t.name,
      })) ?? []
    );
  };

  return (
    <MultipleSelector
      defaultOptions={mapTagsToOptions(initialTagData?.data ?? [])}
      onSelect={(value) => {
        console.log('onSelect', value);
      }}
      onCreate={(value) => {
        console.log('onCreate', value);
      }}
      onRemove={(value) => {
        console.log('onRemove', value);
      }}
      onSearch={async (value) => {
        return await searchMutation.mutateAsync(value);
      }}
      hidePlaceholderWhenSelected
      triggerSearchOnFocus
      placeholder="Search Tags..."
      creatable
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
