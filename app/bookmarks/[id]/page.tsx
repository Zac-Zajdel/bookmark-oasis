'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { data: bookmark } = useQuery({
    queryKey: ['bookmark-details', params.id],
    queryFn: async (): Promise<Bookmark | undefined> => {
      const { success, message, data }: OasisResponse<Bookmark> = await (
        await fetch(`/api/bookmarks/${params.id}`)
      ).json();

      if (!success) {
        toast.error(message);
        return;
      }

      return data;
    },
  });

  return (
    <div className="container mt-10">
      <Link
        href="/bookmarks"
        prefetch={false}
      >
        <Button variant="outline">
          <ChevronLeft className="mr-1 size-4" />
          Back
        </Button>
      </Link>
      <div className="mt-10">
        <Card>
          <div className="flex items-start space-y-1.5 p-6">
            <div className="mr-4 w-48 overflow-hidden">
              <div className="relative mx-auto pb-[56.25%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bookmark?.imageUrl || '/placeholder.svg'}
                  alt={bookmark?.title}
                  className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                />
              </div>
            </div>
            <div className="font-medium">
              <h1>{bookmark?.title}</h1>
              <p className="pt-3 text-sm text-gray-700 dark:text-gray-400">
                {bookmark?.description}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
