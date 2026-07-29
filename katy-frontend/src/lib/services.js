import { Home, Building, Hammer, FileText, Handshake } from 'lucide-react';

export const SERVICES = [
  {
    key: 'rentals',
    slug: '/rentals',
    name: 'Rentals',
    tagline: 'Short-term & long-term rentals',
    description: 'Tenant placement, lease management, rent collection, and maintenance coordination for property owners.',
    icon: Home,
  },
  {
    key: 'buy_sell',
    slug: '/buy-sell',
    name: 'Buy & Sell',
    tagline: 'Property buying and selling',
    description: 'Buyer and seller representation, market analysis, and offer negotiation from first viewing to closing.',
    icon: Building,
  },
  {
    key: 'renovations',
    slug: '/renovations',
    name: 'Renovations',
    tagline: 'Interior & exterior renovations',
    description: 'Full project management — budget planning, vendor coordination, permits, and design consultation.',
    icon: Hammer,
  },
  {
    key: 'titling',
    slug: '/titling',
    name: 'Titling',
    tagline: 'Title transfer & documentation',
    description: 'Title search, deed preparation, filing, notarization coordination, and compliance review.',
    icon: FileText,
  },
  {
    key: 'agents',
    slug: '/agents',
    name: 'Agents',
    tagline: 'Agent sourcing & recruitment',
    description: 'Join our referral network — zero cost to apply, commission paid out when your referral closes.',
    icon: Handshake,
  },
];

export function getService(key) {
  return SERVICES.find((s) => s.key === key);
}
