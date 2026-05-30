// Application constants
export const APP_NAME = 'ADS SKILL INDIA';
export const APP_DESCRIPTION = 'Your skill development platform';

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MASTER_ADMIN: 'master_admin',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;
