module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'class-methods-use-this': 'off', // https://eslint.org/docs/rules/class-methods-use-this
    'no-new': 'off', // https://eslint.org/docs/rules/no-new
    'no-plusplus': 'off', // https://eslint.org/docs/rules/no-plusplus
    'no-restricted-globals': 'off', // https://eslint.org/docs/rules/no-restricted-globals
    'no-underscore-dangle': 'off', // https://eslint.org/docs/rules/no-underscore-dangle
  },
  env: {
    browser: true,
    jquery: true,
  },
  globals: {
    Shopify: 'readonly',
    QRCode: 'readonly',
    ActiveXObject: 'readonly',
    YT: 'readonly',
  }
};
