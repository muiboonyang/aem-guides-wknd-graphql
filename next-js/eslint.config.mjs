import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from '@next/eslint-plugin-next';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import codeceptPlugin from 'eslint-plugin-codeceptjs';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig =  [
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // If ignores is used without any other keys in the configuration object, then the patterns act as global ignores.
    // This pattern is added after the default patterns, which are ["**/node_modules/", ".git/"].
    //  You can also use negation patterns in ignores to exclude files from the ignore patterns.
    // Here, the configuration object excludes files ending with .config.js except for eslint.config.mjs.
    ignores: [
      '**/.next/*',
      '**/test/*',
      '**/*.{config,conf,d}.{js,ts,tsx}',
      '!**/eslint.config.mjs', // example - if we want to exclude all configs except this file
      'src/globalDispatch.cjs',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/*.e2e.test.ts'],
    languageOptions: {
      parser: typescriptParser,
      globals: globals.node,
      parserOptions: {
        ecmaFeatures: {modules: true},
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {},
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    rules: {
      // Default configurations
      ...typescriptPlugin.configs['eslint-recommended'].rules,
      ...typescriptPlugin.configs['recommended'].rules,
      ...prettierPlugin.configs['recommended'].rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...nextPlugin.configs['recommended'].rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // ...importPlugin.configs['recommended'].rules,

      // Additional configurations
      '@next/next/no-img-element': 'error', // warning if user uses <img> html tag
      '@next/next/no-html-link-for-pages': ['error', ['pages/', 'app/']],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/no-unresolved': 'warn',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*{.,_}{test,spec}.{ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
            '**/*.fixture.ts',
            'setupVitest.ts',
            'vitest.config.ts',
          ],
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Built-in imports (come from Node.js native) go first
            'external', // <- External imports
            'internal', // <- Absolute imports
            ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
            'index', // <- index imports
            'unknown', // <- unknown
          ],
          'newlines-between': 'always',
          alphabetize: {
            /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
            order: 'asc',
            /* ignore case. Options: [true, false] */
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],

      // Turn off rules affecting importing of external packages
      'import/namespace': 'off',
      'import/default': 'off',

      // Temporarily disable rules until plugins are updated
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-page-custom-font': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    files: ['**/*.e2e.test.ts'],
    plugins: {
      codeceptjs: codeceptPlugin,
    },
    rules: {
      // Default configurations
      ...codeceptPlugin.configs.recommended.rules,
      'max-len': [
        'error',
        {code: 200, ignoreStrings: true, ignoreUrls: true},
      ],
      'object-curly-newline': [
        'error',
        {
          ObjectPattern: {multiline: true},
        },
      ],
      'object-curly-spacing': 'off',
      'implicit-arrow-linebreak': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/extensions': 'off',
      'codeceptjs/no-exclusive-tests': 'off',
      'codeceptjs/no-skipped-tests': 'off',
      'codeceptjs/no-pause-in-scenario': 'off',
    },
  },
];

export default eslintConfig;
