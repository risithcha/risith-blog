// ESLint configuration for Next.js with Prettier integration
// Based on official Next.js documentation: https://nextjs.org/docs/app/api-reference/config/eslint
// Prettier integration: https://github.com/prettier/eslint-config-prettier

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  prettier,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**'],
  },
];

export default eslintConfig;
