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
import { useCreateBookmarkMutation } from '@/hooks/api/bookmarks/useCreateBookmarkMutation';
import { queryClient } from '@/lib/utils';
import { Bookmark, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export default function BookmarkHeader({
  onSearch,
}: {
  onSearch: (search: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const createBookmarkMutation = useCreateBookmarkMutation();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value);
  };

  const onCreate = () => {
    createBookmarkMutation.mutate(bookmarkUrl, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['bookmarks'],
        });
        setDialogOpen(false);
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
            <Bookmark className="mr-2 size-4" />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[525px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              type="url"
              onChange={(event) => setBookmarkUrl(event?.target.value)}
              placeholder="Bookmark URL . . ."
            />
          </div>
          <DialogFooter>
            <Button
              onClick={onCreate}
              disabled={createBookmarkMutation.isPending}
            >
              {createBookmarkMutation.isPending ? (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              ) : (
                <Bookmark className="mr-2 size-4" />
              )}
              Add Bookmark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
