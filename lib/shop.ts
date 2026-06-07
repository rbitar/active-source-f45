// ─── Header Navigation ────────────────────────────────────────────────────────
export const headerNavLinks = [
  { href: '/shop/collections/f45-mens', label: 'Men' },
  { href: '/shop/collections/f45-womens', label: 'Women' },
  { href: '/shop/collections', label: 'Shop by Collection' },
];

// ─── Core Collections ─────────────────────────────────────────────────────────
export const coreCollections = {
  mens: { label: "Men's", handle: 'f45-mens' },
  womens: { label: "Women's", handle: 'f45-womens' },
  accessories: { label: 'Accessories', handle: 'accessories' },
};

// ─── Featured Collections (Shop by Collection sheet) ─────────────────────────
export const featuredCollections = [
  { label: 'F45 x HYROX', handle: 'f45-x-hyrox' },
  { label: 'I Love F45 Training', handle: 'i-love-f45-training' },
  { label: 'F45 Logo Stamp', handle: 'logo-stamp' },
  { label: 'F45 Peak500', handle: 'f45peak500' },
  { label: 'Milestone', handle: 'milestone-4' },
  { label: 'F45 City & State', handle: 'f45-cityscape' },
  { label: 'Passport Stamp', handle: 'passport-stamp' },
  { label: 'Lift Club', handle: 'lift-club' },
  { label: 'Accessories', handle: 'accessories-4' },
];

// ─── Home Page Carousels ──────────────────────────────────────────────────────
export const homeCarousels = [
  {
    handle: 'featured-products',
    title: 'Featured Products',
    label: undefined as string | undefined,
    showViewAll: true,
  },
  {
    handle: 'hyrox',
    title: 'Hyrox',
    label: 'New Arrivals',
    showViewAll: true,
  },
  {
    handle: 'f45-mens',
    title: 'F45 Logo Stamp',
    label: 'Men',
    showViewAll: true,
  },
  {
    handle: 'f45-womens',
    title: 'F45 Logo Stamp',
    label: 'Women',
    showViewAll: true,
  },
];
