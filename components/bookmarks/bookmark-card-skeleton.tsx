import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookmarkCardSkeleton() {
  return (
    <Card>
      <div className="flex h-full w-full flex-col justify-between p-4">
        <div className="mb-4 h-[24px]">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mb-4 h-[40px]">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="relative pb-[56.25%]">
          <Skeleton className="absolute left-0 top-0 h-full w-full rounded-md" />
        </div>
      </div>
    </Card>
  );
}
