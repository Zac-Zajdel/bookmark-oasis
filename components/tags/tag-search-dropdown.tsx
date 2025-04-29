'use client';

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useTagsQuery } from '@/hooks/api/tags/useTagsQuery';
import { OasisResponse } from '@/types/apiHelpers';
import { Tag } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type TagSearchDropdownProps = {
  onSelect?: (value: Option) => void;
  onCreate?: (value: Option) => void;
  onRemove?: (value: Option) => void;
  bookmarkId?: string;
  isPendingMutation?: boolean;
};

export default function TagSearchDropdown({
  onSelect,
  onCreate,
  onRemove,
  bookmarkId,
  isPendingMutation,
}: TagSearchDropdownProps) {
  const [selectedTags, setSelectedTags] = useState<Partial<Tag>[]>([]);

  const { data: initialTagData } = useTagsQuery({
    pageSize: 10,
    pageIndex: 0,
    column: 'id',
    order: 'asc',
    globalFilter: '',
    bookmarkId,
  });

  // Update selectedTags when initialTagData changes and we're not in a pending mutation
  useEffect(() => {
    if (initialTagData?.data && !isPendingMutation) {
      setSelectedTags(initialTagData.data);
    }
  }, [initialTagData?.data, isPendingMutation]);

  const searchMutation = useMutation({
    mutationFn: async (searchTerm: string): Promise<Option[]> => {
      const queryParams = new URLSearchParams({
        page: '1',
        limit: '10',
        column: 'id',
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

  const mapTagsToOptions = (tags: Partial<Tag>[]): Option[] => {
    return (
      tags?.map((tag: Partial<Tag>) => ({
        id: tag.id ?? '',
        label: tag.name ?? '',
        name: tag.name ?? '',
        value: tag.name ?? '',
        color: tag.color ?? '',
      })) ?? []
    );
  };

  return (
    <MultipleSelector
      value={mapTagsToOptions(selectedTags)}
      defaultOptions={mapTagsToOptions(initialTagData?.data ?? [])}
      onSelect={(value) => {
        setSelectedTags((prev) => [
          ...prev,
          { id: value.id, name: value.label, color: value.color },
        ]);

        onSelect?.(value);
      }}
      onCreate={(value) => {
        setSelectedTags((prev) => [
          ...prev,
          { id: value.id, name: value.label, color: value.color },
        ]);
        onCreate?.(value);
      }}
      onRemove={(value) => {
        setSelectedTags((prev) => prev.filter((tag) => tag.id !== value.id));
        onRemove?.(value);
      }}
      onSearch={async (value: string) =>
        await searchMutation.mutateAsync(value)
      }
      isPendingMutation={isPendingMutation}
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
