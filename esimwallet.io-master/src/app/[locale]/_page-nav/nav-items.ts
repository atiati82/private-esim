import { urlForAccount, urlForMyWallet, UrlForPage, urlForPage } from '@/lib/urls';

export type NavItem = {
  label: string;
  href: string;
  title?: string;
};

export const navItems: NavItem[] = [
  {
    label: 'Browse Store',
    href: urlForPage(UrlForPage.StoreLocalEsim),
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'About Us',
    href: '/about',
  },
  {
    label: 'FAQ',
    href: '#',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

export const customerNavItems: NavItem[] = [
  {
    label: 'My Account',
    href: urlForAccount(),
  },
  {
    label: 'My Wallet',
    href: urlForMyWallet(),
  },
  {
    label: 'Login',
    href: urlForAccount('login'),
  },
  {
    label: 'Create Account',
    href: urlForAccount('create'),
  },
];
