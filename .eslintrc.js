module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@tanstack/query', 'import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        // this is for sorting WITHIN an import
        'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
        // this is for sorting imports
        'import/order': [
          'error',
          {
            groups: [['external', 'builtin'], 'internal', ['sibling', 'parent'], 'index'],
            pathGroups: [
              {
                pattern: '@(react|react-native)',
                group: 'external',
                position: 'before',
              },
              {
                pattern: '@src/**',
                group: 'internal',
              },
              {
                pattern: '@assets/**',
                group: 'internal',
              },
              {
                pattern: '@components/**',
                group: 'internal',
              },
              {
                pattern: '@hooks/**',
                group: 'internal',
              },
              {
                pattern: '@navigation/**',
                group: 'internal',
              },
              {
                pattern: '@screens/**',
                group: 'internal',
              },
              {
                pattern: '@services/**',
                group: 'internal',
              },
              {
                pattern: '@theme',
                group: 'internal',
              },
              {
                pattern: '@utils/**',
                group: 'internal',
              },
            ],
            pathGroupsExcludedImportTypes: ['internal', 'react'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
        'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      },
    },
  ],
};
