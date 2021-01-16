module.exports = {
  extends: ['airbnb-typescript/base'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'no-underscore-dangle': [
      'error',
      { allowAfterThis: true },
    ],
  },
};
