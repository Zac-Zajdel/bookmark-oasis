import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function FolderCardSkeleton() {
  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-lg">
      <CardHeader className="flex flex-col p-5">
        <div className="flex items-center pt-1">
          <div className="mr-4 size-7 items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="size-36 h-full overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="mt-2 h-8" />
        </div>
      </CardHeader>

      <Separator className="opacity-75" />

      <div className="px-4 py-2.5">
        <Skeleton className="size-6 w-32" />
      </div>
    </Card>
  );
}
