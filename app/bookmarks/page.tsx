'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Bookmarks() {
  const { data: session } = useSession();
  const [url, setUrl] = useState('');

  const mutation = useMutation({
    mutationFn: createBookmark,
  });

  async function createBookmark() {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({
        url: url,
      }),
    });

    const jsonData = await response.json();
    if (!jsonData.success) {
      toast.error(jsonData.message);
    } else {
      toast.success(jsonData.message);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-10 mt-24">
      <div>ID: {session?.user?.id}</div>
      <div>Name: {session?.user?.name}</div>

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

      <div className="flex items-center space-x-4">
        <Input
          type="url"
          value={url}
          className="w-96"
          onChange={(event) => setUrl(event?.target.value)}
          placeholder="Supply Bookmark URL Here..."
        />
        <Button
          variant="outline"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate();
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
