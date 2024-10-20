import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBookmarkMutation } from '@/hooks/api/bookmarks/useCreateBookmarkMutation';
import { cn, queryClient } from '@/lib/utils';
import { Bookmark } from '@prisma/client';
import { Bookmark as BookmarkIcon, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BookmarkHeader({
  onSearch,
}: {
  onSearch: (search: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [bookmarkDescription, setBookmarkDescription] = useState('');
  const createBookmarkMutation = useCreateBookmarkMutation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value);
  };

  const onCreate = () => {
    createBookmarkMutation.mutate(bookmarkUrl, {
      onSuccess: async ({
        bookmark,
        message,
      }: {
        bookmark: Bookmark;
        message: string;
      }) => {
        toast.success(
          <div>
            <div className="pb-3">{message}</div>
            <Link
              href={`/bookmarks/${bookmark.id}`}
              className="hover:underline"
            >
              View Bookmark
            </Link>
          </div>,
          {
            duration: 5000,
          },
        );

        await queryClient.invalidateQueries({
          queryKey: ['bookmarks'],
        });

        setDialogOpen(false);
      },
      onError(error) {
        toast.error(error.message);
        setIsManual(true);
      },
    });
  };

  return (
    <div className="container flex items-center justify-between space-x-4">
      <Input
        className="w-72"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search Bookmarks"
      />
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogTrigger asChild>
          <Button>
            <BookmarkIcon className="mr-2 size-4" />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[525px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <div className="-mt-2 space-x-3 text-sm">
              <button
                className={cn(
                  !isManual
                    ? 'border-b border-b-muted-foreground dark:border-b-white'
                    : 'text-muted-foreground',
                  'whitespace-nowrap px-1 pb-0.5 font-medium',
                )}
                onClick={() => setIsManual(false)}
              >
                Automatic
              </button>
              <button
                className={cn(
                  isManual
                    ? 'border-b border-b-muted-foreground'
                    : 'text-muted-foreground',
                  'whitespace-nowrap px-1 pb-0.5 font-medium',
                )}
                onClick={() => setIsManual(true)}
              >
                Manual
              </button>
            </div>
          </DialogHeader>

          {isManual && (
            <>
              <div className="my-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  className="mt-1"
                  autoFocus
                  onChange={(event) => setBookmarkTitle(event?.target.value)}
                  placeholder="Bookmark Title . . ."
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  className="mt-1"
                  value={bookmarkUrl}
                  onChange={(event) => setBookmarkUrl(event?.target.value)}
                  placeholder="Bookmark URL . . ."
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="mt-1"
                  placeholder="Bookmark Description . . ."
                  onChange={(e) => setBookmarkDescription(e.target.value)}
                />
              </div>
            </>
          )}

          {!isManual && (
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                type="url"
                id="title"
                className="mt-1"
                autoFocus
                value={bookmarkUrl}
                onChange={(event) => setBookmarkUrl(event?.target.value)}
                placeholder="Bookmark URL . . ."
              />
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={onCreate}
              disabled={createBookmarkMutation.isPending}
            >
              {createBookmarkMutation.isPending ? (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              ) : (
                <BookmarkIcon className="mr-2 size-4" />
              )}
              Add Bookmark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
