import { UrlForPage, urlForPage } from '@/lib/urls';

export const HowItWorksData = [
  {
    title: 'Check Device Compatibility',
    description: 'Check your device compatibility before you buy eSIM online.',
    href: `${urlForPage(UrlForPage.CompatibleDevices)}`,
    url: '/images/how-it-works/step-1.webp',
  },
  {
    title: 'Choose Your Plan',
    description: 'Find the ideal eSIM plan that fits your budget, data needs, and preferred area.',
    href: `${urlForPage(UrlForPage.StoreLocalEsim)}`,
    url: '/images/how-it-works/step-2.webp',
  },
  {
    title: 'Activate Your eSIM',
    description:
      'Scan the QR code we send you and activate your virtual sim card online fast and easy in just 3 minutes.',
    href: '/',
    url: '/images/how-it-works/step-3.webp',
  },
  {
    title: 'You’re Ready to Go!',
    description:
      'Enjoy seamless internet access anywhere and say goodbye to roaming charges and physical SIM cards.',
    href: `${urlForPage(UrlForPage.MyWallet)}`,
    url: '/images/how-it-works/step-4.webp',
  },
];
