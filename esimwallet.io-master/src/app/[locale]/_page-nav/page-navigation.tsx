import React from 'react';

import { urlForCart } from '@/lib/urls';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

import { EsimWalletLogoLink } from '@/components/icons/esimwallet-logo';
import { NavMenuIcon } from '@/components/icons/nav-menu.icon';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui.shadcn/command';
import { Button } from '@/components/ui.shadcn/form/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui.shadcn/popover';
import { customerNavItems, NavItem, navItems } from './nav-items';
import * as styles from './page-navigation.css';

export const PageNavigation: React.FC = () => {
  const NavItem = (navItem: NavItem, index: number): React.ReactElement => {
    return (
      <CommandItem key={index} linkInside={true} variant="navItem">
        <Link href={navItem.href} title={navItem.title}>
          {navItem.label}
        </Link>
      </CommandItem>
    );
  };

  return (
    <header className={styles.stickyWrapper}>
      <div className={styles.container}>
        <EsimWalletLogoLink />

        <nav className={styles.nav}>
          {navItems.map((navItem, index) => {
            return (
              <Link
                key={index}
                href={navItem.href}
                className={cn(styles.navItem, index === 0 && 'active')}
              >
                {navItem.label}
              </Link>
            );
          })}
        </nav>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className={styles.mobileNavTrigger}
              data-testid="hamburger-menu-trigger"
            >
              <NavMenuIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" style={{ width: '16rem' }}>
            <Command>
              <CommandList
                className={styles.mobileCommandList}
                data-testid="hamburger-menu-content"
              >
                {NavItem({ href: urlForCart(), label: 'Your Cart', title: 'Your Cart' }, 999)}

                <CommandSeparator className={styles.hideWhenMainNavVisible} />
                <CommandGroup
                  heading="Private eSIM site menu"
                  className={styles.hideWhenMainNavVisible}
                >
                  {navItems.map(NavItem)}
                </CommandGroup>

                <CommandSeparator />
                <CommandGroup heading="My Wallet">{customerNavItems.map(NavItem)}</CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};
