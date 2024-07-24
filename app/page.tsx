'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center space-x-10 p-32">
        <p>Go to /login page</p>
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
      </div>
    </main>
  );
}
