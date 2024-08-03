'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { OasisError } from '@/lib/oasisError';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function Bookmarks() {
  const { data: session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ['bookmark-create'],
    queryFn: async () => await getOGData(),
  });

  async function getOGData(): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://sonner.emilkowal.ski/',
      }),
    });

    const jsonData = await response.json();

    if (!response.ok) {
      throw new OasisError(jsonData?.message, 404);
    }

    return jsonData;
  }

  return (
    <div className="flex flex-col items-center space-y-10 mt-24">
      <div>ID: {session?.user?.id}</div>
      <div>Name: {session?.user?.name}</div>

      <div>
        API RESPONSE: {isLoading && <span>Loading...</span>} {data?.message}
      </div>

      <ModeToggle />
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
