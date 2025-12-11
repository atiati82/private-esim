import type { Locator } from '@playwright/test';

import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  getHeroHeader(): Locator {
    return this.page.getByRole('main').getByRole('heading');
  }

  /**
   * Locate search box for destination search
   */
  getDestinationSearchBox(): Locator {
    return this.page.getByRole('main').getByRole('searchbox');
  }
  /**
   * Locate search box for destination search - opened on the popover dialog
   */
  getDestinationSearchBoxOnPopover(): Locator {
    return this.page.getByRole('dialog').getByRole('searchbox');
  }
  /**
   * Locate search result items
   */
  getDestinationSearchResults(): Locator {
    return this.page.getByRole('dialog').getByRole('listbox').getByRole('option');
  }
  /**
   * Locate search result info (e.g. loading, nothing found etc)
   */
  getDestinationSearchResultsTextInfo(): Locator {
    return this.page.getByRole('dialog').getByTestId('search-results-info');
  }
  /**
   * Locate search box icon (lucide-loader or lucide-search icon)
   */
  getDestinationSearchBoxIcon(iconName: 'search' | 'loader' = 'search'): Locator {
    return this.page.getByRole('dialog').locator(`svg.lucide-${iconName}`);
  }

  /**
   * Locate main nav hamburger menu icon
   */
  getHamburgerMenuTrigger(): Locator {
    return this.page.getByTestId('hamburger-menu-trigger');
  }
  getHamburgerMenuContent(): Locator {
    return this.page.getByTestId('hamburger-menu-content');
  }
  getHamburgerMenuItems(): Locator {
    return this.getHamburgerMenuContent().locator('a');
  }

  getLanguageSwitcher(): Locator {
    return this.page.getByTestId('language-switcher');
  }
  getLanguageSwitcherOption(optionText: string): Locator {
    return this.page.getByRole('listbox').getByRole('option').getByText(optionText);
  }
}
