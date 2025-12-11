import { UrlForPage, urlForPage } from '@/lib/urls';

import { PaymentsAmericanExpressLogo } from '@/components/icons/payments/payments-amex';
import { PaymentsMasterCardLogo } from '@/components/icons/payments/payments-master-card';
import { PaymentsPayPalLogo } from '@/components/icons/payments/payments-paypal';
import { PaymentsVisaLogo } from '@/components/icons/payments/payments-visa';
import { SocialFacebookLogo } from '@/components/icons/social/social-facebook';
import { SocialInstagramLogo } from '@/components/icons/social/social-instagram';
import { SocialLinkedinLogo } from '@/components/icons/social/social-linkedin';
import { SocialXLogo } from '@/components/icons/social/social-x';

const exploreSIMwallet = [
  {
    name: 'About Us',
    url: `${urlForPage(UrlForPage.AboutUs)}`,
  },
  {
    name: 'Store',
    url: `${urlForPage(UrlForPage.StoreLocalEsim)}`,
  },
  {
    name: 'Local eSIM plans',
    url: `${urlForPage(UrlForPage.StoreLocalEsim)}`,
  },
  {
    name: 'Regional eSIM plans',
    url: `${urlForPage(UrlForPage.StoreRegionalEsim)}`,
  },
  {
    name: 'Global eSIM plans',
    url: `${urlForPage(UrlForPage.StoreGlobalEsim)}`,
  },
  {
    name: 'Blog',
    url: `${urlForPage(UrlForPage.Blog)}`,
  },
];

const customerCare = [
  {
    name: 'Activation Guide',
    url: `${urlForPage(UrlForPage.ActivationGuide)}`,
  },
  {
    name: 'FAQs',
    url: `${urlForPage(UrlForPage.Faq)}`,
  },
];

const legal = [
  {
    name: 'Terms of Service',
    url: `${urlForPage(UrlForPage.GeneralTermsAndConditions)}`,
  },
  {
    name: 'Privacy Policy',
    url: `${urlForPage(UrlForPage.PrivacyPolicy)}`,
  },
  {
    name: 'Ordering & Payment Policy',
    url: `${urlForPage(UrlForPage.OrderingPaymentPolicy)}`,
  },
  {
    name: 'Returns & Refunds Policy',
    url: `${urlForPage(UrlForPage.ReturnsRefundsPolicy)}`,
  },
];

const contact = [
  {
    name: 'support@esimwallet.io',
    url: 'mailto:support@esimwallet.io',
  },
  {
    name: 'Contact Us',
    url: `${urlForPage(UrlForPage.ContactUs)}`,
  },
];

export const footerLinks = {
  exploreSIMwallet,
  customerCare,
  legal,
  contact,
};

export const footerSocialMediaLinks = [
  {
    name: 'Facebook',
    src: SocialFacebookLogo,
    href: '/#',
  },
  {
    name: 'Instagram',
    src: SocialInstagramLogo,
    href: '/#',
  },
  {
    name: 'X',
    src: SocialXLogo,
    href: '/#',
  },
  {
    name: 'Linkedin',
    src: SocialLinkedinLogo,
    href: '/#',
  },
];

export const footerPaymentLogos = [
  {
    name: 'Visa',
    src: PaymentsVisaLogo,
  },
  {
    name: 'Master Card',
    src: PaymentsMasterCardLogo,
  },
  {
    name: 'Paypal',
    src: PaymentsPayPalLogo,
  },
  {
    name: 'American Express',
    src: PaymentsAmericanExpressLogo,
  },
];
