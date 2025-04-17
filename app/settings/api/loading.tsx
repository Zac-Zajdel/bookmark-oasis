import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { KeyRound } from 'lucide-react';

export default function Loading() {
  return (
    <div className="mt-10">
      <div className="mt-10 flex flex-col">
        <SectionHeader
          title="API Tokens"
          description="Manage your API credentials."
        >
          <Button disabled>
            <KeyRound className="mr-2 size-4" />
            Create
          </Button>
        </SectionHeader>
      </div>
    </div>
  );
}
