'use client';

import { DynamicIcon } from '@/components/icons/dynamic-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder } from '@prisma/client';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

// TODO - Experiment with that...
// type FolderWithCount = Folder & {
//   _count: {
//     bookmarks: number;
//   };
// };

export default function FolderCard({ folder }: { folder: Folder }) {
  return (
    <Card className="flex h-full w-full flex-col justify-between rounded-lg bg-secondary/20 dark:bg-background">
      <div className="flex w-full items-center justify-between px-3 py-2">
        <Link
          href={`/folders/${folder.id}`}
          className="min-w-0 flex-1 hover:underline"
        >
          <div className="flex items-center">
            <div className="inline-flex size-7 items-center justify-center rounded-md border shadow-sm">
              <DynamicIcon
                name={folder.iconName ?? 'Search'}
                className="size-3.5"
              />
            </div>
            <h1 className="min-w-0 flex-1 truncate whitespace-nowrap pl-2 text-xs font-semibold leading-snug tracking-tight">
              {folder.title}
            </h1>
          </div>
        </Link>
        <Button
          variant="ghost"
          className="ml-1 size-6 rounded-md border p-1"
        >
          <span className="sr-only">Open menu</span>
          <EllipsisVertical className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
