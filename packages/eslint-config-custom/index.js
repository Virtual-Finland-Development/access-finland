module.exports = {
  plugins: ['jsx-a11y'],
  extends: ['next', 'turbo', 'prettier', 'plugin:jsx-a11y/recommended'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};
