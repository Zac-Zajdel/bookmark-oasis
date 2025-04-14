'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Bookmark } from '@prisma/client';
import {
  BookOpen,
  Link,
  SquareArrowOutUpRight,
  Star,
  Trash,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BookmarkActionsProps {
  bookmark: Bookmark;
  onDelete: (bookmark: Bookmark) => void;
  onFavorite: (bookmark: Bookmark) => void;
  onVisit: (bookmark: Bookmark) => void;
}

export default function BookmarkActions({
  bookmark,
  onDelete,
  onFavorite,
  onVisit,
}: BookmarkActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const copy = useCopyToClipboard();

  function onCopyLink(url: string | undefined) {
    if (!url) return;
    copy(url)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  }

  function visitLink() {
    window.open(bookmark.url, '_blank');

    if (pathname !== '/') {
      onVisit(bookmark);
    }
  }

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-7 items-center justify-center"
            onClick={visitLink}
          >
            <SquareArrowOutUpRight className="size-4 hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-500" />
            <span className="sr-only">Visit URL</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Visit URL</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-7 items-center justify-center"
            disabled={pathname === '/'}
            onClick={() =>
              bookmark.id ? router.push(`/bookmarks/${bookmark.id}`) : null
            }
          >
            <BookOpen className="size-4 hover:text-indigo-500 dark:text-gray-200 dark:hover:text-indigo-500" />
            <span className="sr-only">Details Page Link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Metadata</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-7 items-center justify-center"
            disabled={pathname === '/'}
            onClick={() =>
              onFavorite({
                ...bookmark,
                isFavorite: !bookmark.isFavorite,
              })
            }
          >
            <Star
              className={`size-4 ${bookmark.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'hover:text-yellow-400 dark:text-gray-200 dark:hover:text-yellow-500'}`}
            />
            <span className="sr-only">
              {bookmark.isFavorite ? 'Remove Favorite' : 'Favorite'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {bookmark.isFavorite ? 'Remove Favorite' : 'Favorite'}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-7 items-center justify-center"
            onClick={() => onCopyLink(bookmark.url)}
          >
            <Link className="size-4 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-500" />
            <span className="sr-only">Copy Link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Link</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex size-7 items-center justify-center"
            disabled={pathname === '/'}
            onClick={() => onDelete(bookmark)}
          >
            <Trash className="size-4 hover:text-red-500 dark:text-gray-200 dark:hover:text-red-500" />
            <span className="sr-only">Delete</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
