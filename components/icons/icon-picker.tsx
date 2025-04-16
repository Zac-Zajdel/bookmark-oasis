import DynamicIcon from '@/components/icons/dynamic-icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { lucideIcons } from '@/types/lucideIcons';
import { IconName } from 'lucide-react/dynamic';
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

const IconButton = React.memo(function IconButton({
  iconName,
  onClick,
  isSelected,
}: {
  iconName: IconName;
  onClick: (iconName: IconName) => void;
  isSelected: boolean;
}) {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`hover:bg-muted-foreground/20 cursor-pointer justify-self-center rounded-md border border-gray-500/50 p-1 ${
              isSelected ? 'bg-muted-foreground/20' : ''
            }`}
            onClick={() => onClick(iconName)}
          >
            <DynamicIcon
              name={iconName}
              size={16}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{iconName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

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

export default function IconPicker({
  onSelectIcon,
}: {
  onSelectIcon: (icon: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);

  const handleIconClick = useCallback(
    (iconName: IconName) => {
      setSelectedIcon(iconName);
      onSelectIcon(iconName);
    },
    [onSelectIcon],
  );

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return lucideIcons;

    return lucideIcons.filter((iconName) =>
      iconName.includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

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
          itemContent={(index: number, iconName: IconName) => (
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
