import { BentoGridContent } from '@/components/landing/bento/bento-grid-container';
import { cn } from '@/lib/utils';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: BentoGridContent) => {
  return (
    <div
      className={cn(
        'group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border bg-gray-50/50 p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none',
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        <div className="flex items-center justify-start">
          <div className="mr-3">{icon}</div>
          <div className="my-2 text-sm font-bold dark:text-neutral-200">
            {title}
          </div>
        </div>

        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
    </div>
  );
};
