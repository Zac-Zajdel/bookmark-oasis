import BookmarkCardSkeleton from '@/components/bookmarks/bookmark-card-skeleton';

export default function FolderPreview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <BookmarkCardSkeleton key={index} />
      ))}
    </div>
  );
}
