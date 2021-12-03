module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    indent: 0,
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'no-console': 0,
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': ['error'],
  },
};
