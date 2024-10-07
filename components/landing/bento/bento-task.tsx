import { Badge } from '@/components/ui/badge';

export function BentoTask() {
  return (
    <div>
      <h1 className="mb-3 font-semibold">Spanish 101</h1>
      <p className="mb-4 text-xs text-muted-foreground">
        Learn common spanish sayings such as questions and introductions.
      </p>
      <div className="flex justify-between pb-3">
        <span className="text-sm text-muted-foreground">Tags:</span>
        <Badge
          variant="secondary"
          className="ml-3 cursor-pointer"
        >
          Language
        </Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Status:</span>
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
