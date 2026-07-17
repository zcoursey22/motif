export default {
  '*.{ts,tsx}': [
    () => 'tsc --noEmit', // Type checking
    'eslint --fix',
    'prettier --write',
  ],
  '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};
