'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  placeholder,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().globalFilter?.length > 0;

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    table.setGlobalFilter(debouncedSearch);
  }, [debouncedSearch, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholder ?? 'Filter...'}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="w-48 sm:w-72"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('');
              table.setGlobalFilter('');
            }}
            className="h-8 px-2 lg:px-3"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
