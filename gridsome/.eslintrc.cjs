module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  env: {
    jest: true,
    node: true
  },
  rules: {
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'comma-dangle': ['warn', 'never'],
    'semi': ['warn', 'never'],
    'padding-line-between-statements': [
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
    'import/no-unresolved': 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/**/*.js'
      ],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
}
