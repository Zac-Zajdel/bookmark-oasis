'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, MonitorCog, Moon, Sun } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'System',
    icon: MonitorCog,
  },
];

export default function ProfileSettings() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, update } = useSession();

  const { theme, setTheme } = useTheme();
  const selectedTheme = themes.find((t) => t.value === theme);

  // TODO - Won't need this once I have the loading.tsx file.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <SectionHeader
        title="Profile"
        description="Adjust your personal information and preferences."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            required
            id="name"
            value={session?.user?.name ?? ''}
            onChange={(e) => {
              // TODO - I need to debounce this update...
              update({ name: e.target.value });
            }}
            className="mt-1"
            placeholder="Name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            required
            id="email"
            type="email"
            disabled
            readOnly
            defaultValue={session?.user?.email ?? ''}
            className="mt-1"
            placeholder="Email"
          />
        </div>

        <div>
          <h2 className="mt-1.5 mb-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Theme
          </h2>
          <Popover
            open={open}
            onOpenChange={setOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {mounted && selectedTheme ? (
                  <div className="flex items-center">
                    {selectedTheme.icon && (
                      <selectedTheme.icon className="mr-2 size-4" />
                    )}
                    {selectedTheme.label}
                  </div>
                ) : (
                  'Select theme...'
                )}
                <ChevronsUpDown className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="flex justify-start p-0"
              align="start"
            >
              <Command>
                <CommandList>
                  <CommandGroup>
                    {themes.map((themeOption) => (
                      <CommandItem
                        key={themeOption.value}
                        value={themeOption.value}
                        onSelect={(currentValue) => {
                          setTheme(currentValue);
                          setOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          {themeOption.icon && (
                            <themeOption.icon className="mr-2 size-4" />
                          )}
                          {themeOption.label}
                        </div>
                        <Check
                          className={cn(
                            'ml-auto',
                            theme === themeOption.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="created">Created</Label>
          <Input
            disabled
            id="created"
            type="text"
            readOnly
            defaultValue={
              session?.user?.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString()
                : ''
            }
            className="mt-1"
            placeholder="Created At"
          />
        </div>
      </div>
    </div>
  );
}
