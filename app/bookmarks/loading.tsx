import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { ChevronLeft, ChevronRightIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div className="container mt-10">
      <div className="flex flex-col">
        <SectionHeader
          title="Bookmarks"
          description="Important and frequently visited websites."
        >
          <Button disabled>Add Bookmark</Button>
        </SectionHeader>

        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <Input
              className="w-56 sm:w-80"
              placeholder="Search Bookmarks..."
              disabled
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <BookmarkCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
