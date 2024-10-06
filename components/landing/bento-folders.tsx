import {
  CircleDollarSign,
  Clapperboard,
  NotebookPen,
  Presentation,
} from 'lucide-react';

export function BentoFolders() {
  return (
    <>
      <div className="flex flex-col divide-y pt-0.5">
        <div className="border-1" />
        <div className="flex w-full items-center justify-start">
          <div className="min-w-8">
            <div className="inline-flex size-7 items-center justify-center rounded-md border">
              <CircleDollarSign className="size-3.5" />
            </div>
          </div>
          <h1 className="h-10 overflow-hidden truncate text-ellipsis whitespace-nowrap pl-2 pt-3 text-xs font-medium">
            Finances
          </h1>
        </div>
        <div className="flex w-full items-center justify-start">
          <div className="min-w-8">
            <div className="inline-flex size-7 items-center justify-center rounded-md border">
              <NotebookPen className="size-3.5" />
            </div>
          </div>
          <h1 className="h-10 overflow-hidden truncate text-ellipsis whitespace-nowrap pl-2 pt-3 text-xs font-medium">
            Homework
          </h1>
        </div>
        <div className="flex w-full items-center justify-start">
          <div className="min-w-8">
            <div className="inline-flex size-7 items-center justify-center rounded-md border">
              <Clapperboard className="size-3.5" />
            </div>
          </div>
          <h1 className="h-10 overflow-hidden truncate text-ellipsis whitespace-nowrap pl-2 pt-3 text-xs font-medium">
            Movie Gallery
          </h1>
        </div>
        <div className="flex w-full items-center justify-start">
          <div className="min-w-8">
            <div className="inline-flex size-7 items-center justify-center rounded-md border">
              <Presentation className="size-3.5" />
            </div>
          </div>
          <h1 className="h-10 overflow-hidden truncate text-ellipsis whitespace-nowrap pl-2 pt-3 text-xs font-medium">
            Presentation Links
          </h1>
        </div>
        <div className="border" />
      </div>
    </>
  );
}
