import globals from 'globals'
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import stylisticPlugin from "@stylistic/eslint-plugin"
// import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  {
    // ignores: ['**/gridsome.client.js'],
    ignores: ['**/node_modules', 'dist'],
    plugins: {
      vue,
      "@stylistic": stylisticPlugin,
    //   importWarnings: importPlugin.configs.warnings,
    //   importErrors: importPlugin.configs.errors,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node
      }
    },
    rules: {
      '@stylistic/quotes': ['warn', 'single', { allowTemplateLiterals: true }],
      '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
      '@stylistic/comma-dangle': ['warn', 'never'],
      '@stylistic/semi': ['warn', 'never'],
      '@stylistic/padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'block' },
        { blankLine: 'always', prev: 'block', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        // Always require blank lines before and after class declaration
        { blankLine: 'always', prev: '*', next: 'class' },
        { blankLine: 'always', prev: 'class', next: '*' }
      ],
      'no-console': 'off',
      // Allow unresolved imports
      // 'import/no-unresolved': 'off'
    }
  }
]
