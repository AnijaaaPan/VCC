module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: 'error',
    quotes: 'error',
    'require-await': 'error',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
  }
}
