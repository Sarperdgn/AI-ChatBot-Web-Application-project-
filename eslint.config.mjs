export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'legacy/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        TextDecoder: 'readonly',
        HTMLElement: 'readonly',
        customElements: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  }
];
