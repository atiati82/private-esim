import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calculator, Calendar, Settings, Smile } from 'lucide-react';

import { Link } from '@/navigation';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui.shadcn/command';
import { Button } from '@/components/ui.shadcn/form/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui.shadcn/popover';

const meta: Meta<typeof Command> = {
  title: 'ui.shadcn / Command',
  component: Command,
  argTypes: {},
  args: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

const CommandExample: React.FC = () => (
  <Command variant="borderContainer">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <Calendar />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem>
          <Smile />
          <span>Search Emoji</span>
        </CommandItem>
        <CommandItem>
          <Calculator />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <span>Billing</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandSeparator />
        <CommandItem>
          <Settings />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);

export const Default: Story = {
  render: () => {
    return (
      <div style={{ width: '16rem' }}>
        <CommandExample />
      </div>
    );
  },
};

export const Simple: Story = {
  render: () => (
    <Command variant="borderContainer" style={{ width: '20rem' }}>
      <CommandList>
        <CommandGroup>
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const SimpleWithInput: Story = {
  render: () => (
    <Command variant="borderContainer">
      <CommandInput placeholder="Search here..." />
      <CommandList>
        <CommandGroup>
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
export const WithEmptyMessage: Story = {
  render: () => (
    <Command variant="borderContainer" style={{ maxWidth: '20rem' }}>
      <CommandInput placeholder="Search here..." />
      <CommandList>
        <CommandEmpty>
          Some error occurred while loading search results. Please reload page and try again.
        </CommandEmpty>
      </CommandList>
    </Command>
  ),
};

export const NoBorderVariant: Story = {
  render: () => (
    <Command>
      <CommandInput placeholder="Search here..." />
      <CommandList>
        <CommandGroup>
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithHeadingsNoSeparators: Story = {
  render: () => (
    <Command variant="borderContainer">
      <CommandList>
        <CommandGroup heading="Command Section One">
          <CommandItem>
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Command Section Two">
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const NavItems: Story = {
  render: () => (
    <Command variant="borderContainer">
      <CommandList>
        <CommandGroup heading="Command Section One">
          <CommandItem linkInside={true} variant="navItem">
            <Link href="">Calendar</Link>
          </CommandItem>
          <CommandItem linkInside={true} variant="navItem">
            <Link href="">Search Emoji</Link>
          </CommandItem>
          <CommandItem linkInside={true} variant="navItem">
            <Link href="">Calculator</Link>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Command Section Two">
          <CommandItem linkInside={true} variant="navItem">
            <Link href="">Settings</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const PopoverWithCommandInside: Story = {
  render: () => (
    <Popover defaultOpen={true}>
      <PopoverTrigger asChild style={{ marginBottom: '16rem' }}>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search here..." />
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ),
};
