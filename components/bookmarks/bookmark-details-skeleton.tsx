import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Save } from 'lucide-react';

export default function BookmarkDetailsSkeleton() {
  return (
    <div className="container mt-5">
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="h-6 w-20" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                <Skeleton className="h-6 w-32" />
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button disabled>
          <Save className="mr-2 size-4" />
          Save
        </Button>
      </div>

      <div className="mt-2 flex flex-row items-center">
        <Card className="mt-5 min-h-24 min-w-24 content-center p-8">
          <div className="flex items-center justify-center">
            <Skeleton className="h-8 w-10" />
          </div>
        </Card>
        <div className="ml-2 mt-1 w-full">
          <div className="mt-3">
            <div className="ml-2 flex">
              <div className="w-full space-y-2">
                <Skeleton className="mb-5 h-6 w-56" />
              </div>
            </div>
          </div>

          <div className="text-sm">
            <div className="ml-2 flex">
              <div className="w-full space-y-2">
                <Skeleton className="h-6 w-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid w-full gap-1.5 pt-5">
        <div className="w-full space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
