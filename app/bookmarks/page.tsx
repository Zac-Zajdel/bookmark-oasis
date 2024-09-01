'use client';

import BookmarkCard from '@/components/bookmarks/bookmark-card';
import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import BookmarkHeader from '@/components/bookmarks/bookmark-header';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Bookmarks() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const { isLoading, data: bookmarks } = useQuery({
    queryKey: ['bookmarks', debouncedSearch, page, itemsPerPage],
    queryFn: async (): Promise<Bookmark[] | []> => {
      const response = await fetch(
        `/api/bookmarks?search=${debouncedSearch}&page=${page}&limit=${itemsPerPage}`,
      );
      const jsonData = await response.json();

      if (!jsonData.success) {
        toast.error(jsonData.message);
        return [];
      }

      setTotalBookmarks(jsonData.data.total);
      return jsonData.data.bookmarks;
    },
  });

  const createBookmarkMutation = useMutation({
    mutationFn: async (bookmarkUrl: string) => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({
          url: bookmarkUrl,
        }),
      });

      const jsonData = await response.json();
      if (!jsonData.success) {
        toast.error(jsonData.message);
      } else {
        toast.success(jsonData.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['bookmarks', debouncedSearch, page, itemsPerPage],
      });
      setIsDialogOpen(false); // Close the dialog on success
    },
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: async (bookmark: Bookmark) => {
      const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: 'DELETE',
      });

      const jsonData = await response.json();
      if (!jsonData.success) {
        toast.error(jsonData.message);
      } else {
        toast.success(jsonData.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['bookmarks', debouncedSearch, page, itemsPerPage],
      });
    },
  });

  const totalPages = bookmarks ? Math.ceil(totalBookmarks / itemsPerPage) : 1;

  return (
    <div className="mt-20 flex flex-col items-center space-y-10">
      <BookmarkHeader
        onSearch={setSearch}
        onCreate={(url) => createBookmarkMutation.mutate(url)}
        isLoading={createBookmarkMutation.isPending}
        onClose={() => setIsDialogOpen(false)}
      />

      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <BookmarkCardSkeleton key={index} />
              ))
            : bookmarks?.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={(bookmark) =>
                    deleteBookmarkMutation.mutate(bookmark)
                  }
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
          Page {page} of {totalPages}
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
