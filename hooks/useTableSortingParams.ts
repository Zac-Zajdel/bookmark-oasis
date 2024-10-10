import { SortingState } from '@tanstack/react-table';

export function useTableSortingParams(sorting: SortingState) {
  return {
    column: sorting?.[0]?.id || undefined,
    order: sorting?.[0]?.desc ? 'desc' : 'asc',
  };
}
