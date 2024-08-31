'use client';

import BookmarkCard from '@/components/bookmarks/bookmark-card';
import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { queryClient } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Bookmarks() {
  const [url, setUrl] = useState('');

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalBookmarks, setTotalBookmarks] = useState(0);

  const { isLoading, data: bookmarks } = useQuery({
    queryKey: ['bookmarks', page, itemsPerPage],
    queryFn: async (): Promise<Bookmark[] | []> => {
      const response = await fetch(
        `/api/bookmarks?page=${page}&limit=${itemsPerPage}`,
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
    mutationFn: async () => {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({
          url: url,
        }),
      });

      const jsonData = await response.json();
      if (!jsonData.success) {
        toast.error(jsonData.message);
      } else {
        toast.success(jsonData.message);
        setUrl('');
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', page] });
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
      await queryClient.invalidateQueries({ queryKey: ['bookmarks', page] });
    },
  });

  const totalPages = bookmarks ? Math.ceil(totalBookmarks / itemsPerPage) : 1;

  return (
    <div className="mt-24 flex flex-col items-center space-y-10">
      <div className="container flex items-center justify-center space-x-4">
        <Input
          type="url"
          value={url}
          onChange={(event) => setUrl(event?.target.value)}
          placeholder="Add Bookmark URL"
        />
        <Button
          variant="outline"
          disabled={createBookmarkMutation.isPending}
          onClick={() => {
            createBookmarkMutation.mutate();
          }}
        >
          Create
        </Button>
      </div>

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
