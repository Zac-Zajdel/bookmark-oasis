'use client';

import BookmarkCard from '@/components/bookmarks/bookmark-card';
import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import BookmarkHeader from '@/components/bookmarks/bookmark-header';
import { Button } from '@/components/ui/button';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Bookmarks() {
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
  const [itemsPerPage] = useState(10);
  const [totalBookmarks, setTotalBookmarks] = useState(0);

  // TODO - Adjust
  const { isLoading, data: bookmarks } = useQuery({
    queryKey: ['bookmarks', debouncedSearch, page, itemsPerPage],
    queryFn: async (): Promise<Bookmark[]> => {
      const {
        success,
        message,
        data,
      }: OasisResponse<{ bookmarks: Bookmark[]; total: number }> = await (
        await fetch(
          `/api/bookmarks?search=${debouncedSearch}&page=${page}&limit=${itemsPerPage}`,
        )
      ).json();

      if (!success) {
        throw toast.error(message);
      }

      setTotalBookmarks(data.total);
      return data.bookmarks;
    },
  });

  const totalPages = bookmarks ? Math.ceil(totalBookmarks / itemsPerPage) : 1;

  return (
    <div className="mt-10 flex flex-col items-center space-y-10">
      <BookmarkHeader onSearch={setSearch} />

      <div className="container">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <BookmarkCardSkeleton key={index} />
              ))
            : bookmarks?.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                />
              ))}
        </div>
      </div>

      <div className="flex w-full max-w-xs items-center justify-between py-8 text-sm">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
