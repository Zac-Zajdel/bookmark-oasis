import { Badge } from '@/components/ui/badge';

export function BentoTask() {
  return (
    <div>
      <h1 className="mb-3 font-semibold">Spanish 101</h1>
      <p className="text-muted-foreground mb-4 text-xs">
        Learn common spanish sayings such as questions and introductions.
      </p>
      <div className="flex justify-between pb-3">
        <span className="text-muted-foreground text-sm">Tags:</span>
        <Badge
          variant="secondary"
          className="ml-3 cursor-pointer"
        >
          Language
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground text-sm">Status:</span>
        <Badge
          variant="secondary"
          className="ml-3 cursor-pointer bg-yellow-200 text-xs text-yellow-700 hover:bg-yellow-200"
        >
          In-Progress
        </Badge>
      </div>
    </div>
  );
}
