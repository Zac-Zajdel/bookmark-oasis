'use client';

import FolderCardSkeleton from '@/components/folders/folder-card-skeleton';
import FolderCreate from '@/components/folders/folder-create';
import { Button } from '@/components/ui/button';
import { EmptyPlaceholder } from '@/components/ui/empty-placeholder';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { useFoldersQuery } from '@/hooks/api/folders/useFoldersQuery';
import { ChevronLeft, ChevronRightIcon, Folder, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FolderSection() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { folders, total, isLoading } = useFoldersQuery(
    debouncedSearch,
    page,
    itemsPerPage,
  );

  const totalPages = folders ? Math.ceil(total / itemsPerPage) : 1;

  // TODO - Non-auth page is /home
  // TODO - Main "dashboard" is just /
  // TODO - Than keep the designated view for /bookmarks like before...
  // TODO - Create designated view for /folders
  // TODO - Fix 404 error page stuff...

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
          {folders.map((_, index) => (
            <FolderCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && folders.length === 0 && (
        <EmptyPlaceholder className="h-42 min-h-42">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Folder className="size-6" />
          </div>
          <EmptyPlaceholder.Title>No folders created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Categorize subjects and topics into folders.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
