export const ActionColor = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warn',
  DELETE: 'error',
  BRAND: 'brand',
} as const;
export type ActionColor = (typeof ActionColor)[keyof typeof ActionColor];
