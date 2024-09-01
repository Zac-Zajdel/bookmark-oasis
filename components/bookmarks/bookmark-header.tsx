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
import { Bookmark } from 'lucide-react';
import { useState } from 'react';

export default function BookmarkHeader({
  onSearch,
  onCreate,
  isLoading,
  onClose,
}: {
  onSearch: (search: string) => void;
  onCreate: (bookmarkUrl: string) => void;
  isLoading: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const [bookmarkUrl, setBookmarkUrl] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="container flex items-center justify-between space-x-4">
      <Input
        className="w-72"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search Bookmarks"
      />
      <Dialog onOpenChange={(open) => !open && onClose()}>
        <DialogTrigger asChild>
          <Button>
            <Bookmark className="mr-2 h-4 w-4" />
            Create
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
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
            <Button onClick={() => onCreate(bookmarkUrl)}>
              <Bookmark className="mr-2 h-4 w-4" />
              Add Bookmark
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
