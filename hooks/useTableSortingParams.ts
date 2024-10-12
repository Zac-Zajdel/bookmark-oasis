import { SortingState } from '@tanstack/react-table';

type SortingResponse = {
  column: string | undefined;
  order: 'desc' | 'asc';
};

export function useTableSortingParams(sorting: SortingState): SortingResponse {
  return {
    column: sorting?.[0]?.id || undefined,
    order: sorting?.[0]?.desc ? 'desc' : 'asc',
  };
}
