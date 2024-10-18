import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import * as LucideIcons from 'lucide-react';
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

type LucideIcon = keyof typeof LucideIcons.icons;

const iconsArray = Object.keys(LucideIcons.icons) as LucideIcon[];

const IconButton = React.memo(function IconButton({
  iconName,
  onClick,
  isSelected,
}: {
  iconName: LucideIcon;
  onClick: (iconName: LucideIcon) => void;
  isSelected: boolean;
}) {
  const IconComponent = LucideIcons[iconName];

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`cursor-pointer justify-self-center rounded-md border border-gray-500/50 p-1 hover:bg-muted-foreground/20 ${
              isSelected ? 'bg-muted-foreground/20' : ''
            }`}
            onClick={() => onClick(iconName)}
          >
            <IconComponent size={16} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{iconName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default function IconPicker({
  onSelectIcon,
}: {
  onSelectIcon: (icon: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon | null>(null);

  const handleIconClick = useCallback(
    (iconName: LucideIcon) => {
      setSelectedIcon(iconName);
      onSelectIcon(iconName);
    },
    [onSelectIcon],
  );

  const filteredIcons = useMemo(() => {
    return iconsArray.filter((iconName) =>
      iconName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const Item = React.forwardRef<HTMLDivElement, { children?: ReactNode }>(
    ({ children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        className="p-1"
      >
        {children}
      </div>
    ),
  );
  Item.displayName = 'VirtuosoItem';

  const List = forwardRef<HTMLDivElement, { children?: ReactNode }>(
    ({ children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        className="grid grid-cols-6 justify-items-center"
      >
        {children}
      </div>
    ),
  );
  List.displayName = 'VirtuosoList';

  return (
    <>
      <Input
        type="text"
        placeholder="Search icons..."
        className="mb-2 w-full rounded-md border border-gray-500/50 p-2"
        value={searchQuery}
        autoFocus
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Separator className="mb-2" />

      <div className="h-[200px]">
        <VirtuosoGrid
          data={filteredIcons}
          style={{ scrollbarWidth: 'none' }}
          components={{
            Item,
            List,
          }}
          itemContent={(index: number, iconName: LucideIcon) => (
            <IconButton
              key={index}
              iconName={iconName}
              onClick={handleIconClick}
              isSelected={selectedIcon === iconName}
            />
          )}
        />
      </div>
    </>
  );
}
