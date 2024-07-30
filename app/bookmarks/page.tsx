'use client';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function Bookmarks() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center space-y-10 mt-24">
      <div>ID: {session?.user?.id}</div>
      <div>Name: {session?.user?.name}</div>

      <ModeToggle />
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </div>
  );
}
