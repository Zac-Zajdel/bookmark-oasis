import * as LucideIcons from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
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
    <div
      className={`cursor-pointer justify-self-center rounded-md border p-2 ${
        isSelected ? 'bg-muted-foreground/20' : ''
      }`}
      onClick={() => onClick(iconName)}
    >
      <IconComponent size={24} />
    </div>
  );
});

export default function EmojiPicker(): JSX.Element {
  const [selectedIcon, setSelectedIcon] = useState<LucideIcon | null>(null);

  const handleIconClick = useCallback((iconName: LucideIcon) => {
    setSelectedIcon(iconName);
  }, []);

  const memoizedIconsArray = useMemo(() => iconsArray, []);

  const Item = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
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

  const List = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>(
    ({ children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        className="grid grid-cols-12 justify-items-center"
      >
        {children}
      </div>
    ),
  );
  List.displayName = 'VirtuosoList';

  return (
    <>
      <div className="mb-5 flex items-center justify-center">
        {selectedIcon ? (
          <>
            <div className="pr-4">
              {React.createElement(LucideIcons[selectedIcon], { size: 32 })}
            </div>
            <p>{selectedIcon}</p>
          </>
        ) : (
          <p>No icon selected</p>
        )}
      </div>

      <div className="h-[200px]">
        <VirtuosoGrid
          data={memoizedIconsArray}
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
