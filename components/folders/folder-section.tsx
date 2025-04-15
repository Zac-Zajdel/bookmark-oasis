'use client';

import FolderCard from '@/components/folders/folder-card';
import FolderCardSkeleton from '@/components/folders/folder-card-skeleton';
import FolderCreate from '@/components/folders/folder-create';
import { Button } from '@/components/ui/button';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { useFoldersQuery } from '@/hooks/api/folders/useFoldersQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { ChevronLeft, ChevronRightIcon, Folder, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FolderSection() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => setPage(1), [debouncedSearch]);

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { folders, totalPages, isLoading } = useFoldersQuery(
    debouncedSearch,
    page,
    itemsPerPage,
  );

  return (
    <div className="mt-10 flex flex-col">
      <SectionHeader
        title="Folders"
        description="Structure and organizer your content."
      >
        <FolderCreate />
      </SectionHeader>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center space-x-2">
          <Input
            className="w-56 sm:w-80"
            value={search}
            onChange={(event) => setSearch(event?.target.value)}
            placeholder="Search Folders..."
          />
          {search.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setSearch('')}
              className="h-8 px-2"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {((!isLoading && folders.length) || isLoading) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <FolderCardSkeleton key={index} />
              ))
            : folders?.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                />
              ))}
        </div>
      )}

      {!isLoading && folders.length === 0 && (
        <EmptyPlaceholder className="min-h-56">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <Folder className="size-6" />
          </div>
          <EmptyPlaceholder.Title>No Folders Found</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Categorize subjects and topics into folders.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
