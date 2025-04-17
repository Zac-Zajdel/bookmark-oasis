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
import { Check, ChevronsUpDown, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const themes = [
  {
    value: 'Light',
    label: 'Light',
    icon: Sun,
  },
  {
    value: 'Dark',
    label: 'Dark',
    icon: Moon,
  },
  {
    value: 'System',
    label: 'System',
  },
];

export default function ProfileSettings() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div>
      <SectionHeader
        title="Profile"
        description="Adjust your personal information and preferences."
      />

      {/* TODO - Use the tanstack form */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            required
            id="name"
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
            className="mt-1"
            placeholder="Email"
          />
        </div>

        <div>
          <Label htmlFor="created">Created</Label>
          <Input
            disabled
            id="created"
            type="date"
            className="mt-1"
            placeholder="Created At"
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
                className="w-full justify-between opacity-70"
              >
                {value
                  ? themes.find((theme) => theme.value === value)?.label
                  : 'Select theme...'}
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
                    {themes.map((theme) => (
                      <CommandItem
                        key={theme.value}
                        value={theme.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        {theme.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            value === theme.value ? 'opacity-100' : 'opacity-0',
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
      </div>
    </div>
  );
}
