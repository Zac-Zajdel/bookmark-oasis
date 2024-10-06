import {
  CircleDollarSign,
  Clapperboard,
  NotebookPen,
  Presentation,
} from 'lucide-react';
import { ReactNode } from 'react';

const folders: { title: string; icon: ReactNode }[] = [
  {
    title: 'Finances',
    icon: <CircleDollarSign className="size-3.5" />,
  },
  {
    title: 'Homework',
    icon: <NotebookPen className="size-3.5" />,
  },
  {
    title: 'Movie Gallery',
    icon: <Clapperboard className="size-3.5" />,
  },
  {
    title: 'Presentation Links',
    icon: <Presentation className="size-3.5" />,
  },
];

export function BentoFolders() {
  return (
    <div className="flex flex-col divide-y pt-0.5">
      {folders.map((folder, i) => {
        return (
          <div
            key={i}
            className="group flex w-full items-center justify-start hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/20"
          >
            <div className="min-w-8">
              <div className="inline-flex size-7 items-center justify-center rounded-md border">
                {folder.icon}
              </div>
            </div>
            <h1 className="h-10 overflow-hidden truncate text-ellipsis whitespace-nowrap pl-1 pt-3 text-xs font-medium transition-all group-hover:pl-2">
              {folder.title}
            </h1>
          </div>
        );
      })}
      <div className="border" />
    </div>
  );
}
