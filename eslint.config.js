import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'

const eslintConfig = defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      'unused-imports/no-unused-imports': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@react', '^[a-z]'],
            ['^(@/|src/)?i18n'],
            ['^(@/|src/)?constant'],
            ['^(@/|src/)?(context|hooks|store|stores|utils|helpers)'],
            ['^(@/|src/)?(components|modules|widgets|sections)(?!.*/skeleton$)', '^\\.\\./'],
            ['^(@/|src/)?sections.*/skeleton$', '^\\.\\./.*/skeleton$'],
            ['^\\./action'],
            // Стили в самый конец
            ['^\\./(?!(index\\.module\\.scss|.*\\.css$))'],
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ImportDeclaration: { multiline: true, minProperties: 4 },
          ExportDeclaration: { multiline: true, minProperties: 4 },
          ObjectExpression: { consistent: true },
          ObjectPattern: { consistent: true },
        },
      ],
      '@stylistic/object-property-newline': 'off',
      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          ignoredNodes: [
            'JSXElement',
            'JSXElement *',
            'JSXFragment',
            'JSXFragment *',
            'ConditionalExpression',
            'JSXAttribute',
            'JSXExpressionContainer',
            'CallExpression > ObjectExpression',
          ],
        },
      ],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
    },
  },

  globalIgnores([
    'dist/**',
    'build/**',
    'out/**',
    'node_modules/**',
    'src/components/Redactor/langs/**',
  ]),
])

export default eslintConfig
