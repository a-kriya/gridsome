module.exports = {
  root: true,
  extends: [
    'plugin:node/recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    jest: true
  },
  rules: {},
  overrides: [
    {
      files: [
        'gridsome.client.js'
      ],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off'
      }
    }
  ]
}
