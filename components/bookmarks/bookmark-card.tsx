'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Bookmark } from '@prisma/client';
import Link from 'next/link';

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const placeholderImageUrl = '/placeholder.svg';

  return (
    <Link
      href={bookmark.url}
      target="_blank"
    >
      <Card className="flex h-full w-full flex-col justify-between">
        <CardHeader className="flex flex-col items-start">
          <div className="text-md h-[32px] font-semibold leading-none tracking-tight">
            <h1 className="line-clamp-1">{bookmark.title}</h1>
          </div>
          <p className="line-clamp-2 h-[36px] overflow-hidden text-sm text-gray-500 text-muted-foreground">
            {bookmark.description || null}
          </p>

          <div className="w-full overflow-hidden pt-4">
            <div className="relative mx-auto pb-[56.25%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bookmark.imageUrl || placeholderImageUrl}
                alt={bookmark.title}
                className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
              />
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
