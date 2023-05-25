const path = require('path');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'route.ts'],
  transpilePackages: ['next-image-export-optimizer', 'vf-shared'],
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // plugin to check for duplicate packages
    config.plugins.push(
      new DuplicatePackageCheckerPlugin({
        exclude(instance) {
          return instance.name === 'react-is';
        },
      })
    );
    // resolve duplicate packages when building (MAKE SURE EVERYTHING WORKS, test the build!)
    config.resolve.alias['@babel/runtime'] = path.resolve(
      __dirname,
      '../../node_modules',
      '@babel/runtime'
    );
    config.resolve.alias['classnames'] = path.resolve(
      __dirname,
      '../../node_modules',
      'classnames'
    );
    config.resolve.alias['date-fns'] = path.resolve(
      __dirname,
      '../../node_modules',
      'date-fns'
    );
    config.resolve.alias['react-dom'] = path.resolve(
      __dirname,
      '../../node_modules',
      'react-dom'
    );
    config.resolve.alias['scheduler'] = path.resolve(
      __dirname,
      '../../node_modules',
      'scheduler'
    );
    return config;
  },
};

module.exports = () => {
  // with bundle analyzer, to run: `ANALYZE=true npm run build`
  return withBundleAnalyzer(nextConfig);
};
