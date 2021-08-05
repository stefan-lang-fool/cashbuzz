module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb'
  ],
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  env: {
    browser: true,
    jasmine: true,
    jest: true,
    node: true
  },
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'camelcase': 'off',
    'linebreak-style': 'off',
    'no-constant-condition': ["error", { "checkLoops": false }],
    'no-control-regex': 'off',
    'no-mixed-operators': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'react/no-array-index-key': 'off',
    'import/no-duplicates': 'off',
    'import/order': ['error', {
      'alphabetize': {
        order: 'asc'
      },
      'groups': [
        'builtin',
        'external',
        'internal'
      ],
      'pathGroups': [
        {
          'pattern': './**',
          'group': 'internal',
          'position': 'after'
        },
        {
          'pattern': '../**',
          'group': 'internal',
          'position': 'after'
        },
        {
          'pattern': '@/**',
          'group': 'internal',
          'position': 'after'
        }
      ],
      'pathGroupsExcludedImportTypes': ['builtin']
    }],
    'import/extensions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-curly-spacing': ['error', { when: 'always', attributes: true, children: true }],
    'no-unused-vars': 'off',
    'react/jsx-filename-extension': 'off',
    '@typescript-eslint/indent': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    'react/jsx-indent-props': 'off',
    'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    'max-len': [
      'error',
      {
        code: 150,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
      }
    ],
    'array-element-newline': ['error', 'consistent'],
    'array-bracket-newline': ['error', { multiline: true }],
    'comma-dangle': ['error', 'never'],
    'multiline-ternary': ['error', 'always-multiline'],
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    'import/no-unresolved': [2, { caseSensitive: false }],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'react/jsx-fragments': 'off',
    'react/jsx-sort-props': ['error'],
    'jsx-a11y/alt-text': 'off'
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        directory: '.'
      },
      alias: {
          map: [
              ['@', './src'],
          ],
          extensions: ['.ts', '.js', '.jsx', '.json']
      }
    }
  },
  parser: '@typescript-eslint/parser'
};
