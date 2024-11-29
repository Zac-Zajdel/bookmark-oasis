import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';
import { SectionHeader } from '@/components/ui/section-header';

export function DashboardRecents() {
  return (
    <div>
      <SectionHeader title="Recently Visited" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <BookmarkCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
