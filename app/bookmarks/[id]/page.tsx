'use client';

import { OasisResponse } from '@/types/apiHelpers';
import { Bookmark } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
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
    <div className="mt-20 flex flex-col items-center space-y-10">
      Bookmark Details ID: {bookmark?.id}
    </div>
  );
}
