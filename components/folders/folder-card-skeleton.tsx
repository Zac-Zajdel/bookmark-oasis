import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function FolderCardSkeleton() {
  return (
    <Card className="bg-secondary/20 dark:bg-background flex h-full w-full flex-col justify-between rounded-lg">
      <div className="flex w-full items-center justify-between px-3 py-2">
        <div className="flex min-w-8 items-center">
          <div className="mr-3 rounded-md border shadow-xs">
            <Skeleton className="size-6" />
          </div>
          <h1 className="rounded-md border shadow-xs">
            <Skeleton className="h-6 w-36" />
          </h1>
        </div>
        <div className="ml-1 rounded-md border shadow-xs">
          <Skeleton className="size-6" />
        </div>
      </div>
    </Card>
  );
}
