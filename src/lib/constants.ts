export const SelfRating = {
  POOR: 'poor',
  BELOW: 'below',
  ABOVE: 'above',
  STRONG: 'strong',
} as const;

export type SelfRating = (typeof SelfRating)[keyof typeof SelfRating];
