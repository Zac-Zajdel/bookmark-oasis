import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBookmarkMutation } from '@/hooks/api/bookmarks/useCreateBookmarkMutation';
import { cn, queryClient } from '@/lib/utils';
import { CreateBookmarkParams } from '@/types/bookmarks';
import { Bookmark } from '@prisma/client';
import { Bookmark as BookmarkIcon, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BookmarkCreate({ folderId }: { folderId?: string }) {
  const [isManual, setIsManual] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createBookmarkMutation = useCreateBookmarkMutation();

  const onCreate = () => {
    let hookContent: CreateBookmarkParams = {
      url,
      folderId,
    };

    if (isManual) {
      hookContent = {
        ...hookContent,
        title,
        description,
        isManual: true,
      };
    }

    createBookmarkMutation.mutate(hookContent, {
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

        setDialogOpen(false);

        await queryClient.invalidateQueries({
          queryKey: ['bookmarks'],
        });
      },
      onError(error) {
        toast.error(error.message);
        if (error.message !== 'Invalid url') setIsManual(true);
      },
    });
  };

  const onDialogChange = () => {
    setDialogOpen(!dialogOpen);
    setIsManual(false);
    setUrl('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="flex items-center justify-between space-x-4">
      <Dialog
        open={dialogOpen}
        onOpenChange={onDialogChange}
      >
        <DialogTrigger asChild>
          <Button>
            <BookmarkIcon className="mr-2 size-4" />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogTitle className="mb-1">Create Bookmark</DialogTitle>
          <DialogHeader>
            <div className="mb-2 space-x-3 text-sm">
              <button
                className={cn(
                  !isManual
                    ? 'border-b-muted-foreground border-b dark:border-b-white'
                    : 'text-muted-foreground',
                  'pb-0.5 font-medium whitespace-nowrap',
                )}
                onClick={() => setIsManual(false)}
              >
                Automatic
              </button>
              <button
                className={cn(
                  isManual
                    ? 'border-b-muted-foreground border-b'
                    : 'text-muted-foreground',
                  'pb-0.5 font-medium whitespace-nowrap',
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
                  autoFocus
                  className="mt-1"
                  placeholder="Bookmark Title . . ."
                  value={title}
                  onChange={(event) => setTitle(event?.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  className="mt-1"
                  value={url}
                  placeholder="Bookmark URL . . ."
                  onChange={(event) => setUrl(event?.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="mt-1"
                  placeholder="Bookmark Description . . ."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </>
          )}

          {!isManual && (
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                autoFocus
                className="mt-1"
                placeholder="Bookmark URL . . ."
                value={url}
                onChange={(event) => setUrl(event?.target.value)}
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
