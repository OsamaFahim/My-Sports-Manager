export const PRODUCT_CATEGORIES = [
  'Jerseys',
  'Sports Shoes',
  'Footballs',
  'Bats'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
