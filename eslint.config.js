import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Modify the typescript-eslint rules to show warnings instead of errors
      '@typescript-eslint/no-explicit-any': 'warn', // Show warning for 'any' usage
      '@typescript-eslint/explicit-module-boundary-types': 'warn', // Warn about missing function return types
      '@typescript-eslint/no-empty-function': 'warn', // Warn about empty functions
      '@typescript-eslint/no-unused-vars': 'warn', // Warn about unused variables
      '@typescript-eslint/no-non-null-assertion': 'warn', // Warn about non-null assertions
    },
  },
)
