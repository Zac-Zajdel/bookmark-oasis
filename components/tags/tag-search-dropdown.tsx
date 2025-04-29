'use client';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useTagsQuery } from '@/hooks/api/tags/useTagsQuery';
import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';

type TagSearchDropdownProps = {
  onSelect?: (value: Option) => void;
  onCreate?: (value: Option) => void;
  onRemove?: (value: Option) => void;
  bookmarkId?: string;
};

export default function TagSearchDropdown({
  onSelect,
  onCreate,
  onRemove,
  bookmarkId,
}: TagSearchDropdownProps) {
  const { data: initialTagData } = useTagsQuery({
    pageSize: 10,
    pageIndex: 0,
    column: 'name',
    order: 'asc',
    globalFilter: '',
    bookmarkId,
  });

  const searchMutation = useMutation({
    mutationFn: async (searchTerm: string): Promise<Option[]> => {
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

      return data.tags.map((tag: Tag) => ({
        id: tag.id,
        label: tag.name,
        name: tag.name,
        value: tag.name,
        color: tag.color,
      }));
    },
  });

  const mapTagsToOptions = (tags: Tag[]): Option[] => {
    return (
      tags?.map((tag: Tag) => ({
        id: tag.id,
        label: tag.name,
        name: tag.name,
        value: tag.name,
        color: tag.color,
      })) ?? []
    );
  };

  return (
    // I need a loading indicator to not make the component jump when the options are coming.
    <MultipleSelector
      value={mapTagsToOptions(initialTagData?.data ?? [])}
      defaultOptions={mapTagsToOptions(initialTagData?.data ?? [])}
      onSelect={(value) => onSelect?.(value)}
      onCreate={(value) => onCreate?.(value)}
      onRemove={(value) => onRemove?.(value)}
      onSearch={async (value: string) =>
        await searchMutation.mutateAsync(value)
      }
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
