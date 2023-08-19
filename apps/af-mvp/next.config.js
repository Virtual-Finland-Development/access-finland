const path = require('path');
const dotenv = require('dotenv').config();
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const nextSafe = require('next-safe');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV !== 'production';
const CODESETS_BASE_URL =
  process.env.NEXT_PUBLIC_CODESETS_BASE_URL || 'http://localhost:3166';

let scriptSrcPolicy = "'self'";

// Allow inline-script for mvp-staging: cognito login callback handler
if (process.env.NEXT_PUBLIC_STAGE === 'mvp-staging') {
  scriptSrcPolicy = "'nonce-vfafmvpstaging' 'self'";
}

// https://trezy.gitbook.io/next-safe/usage/configuration
const nextSafeConfig = {
  isDev,
  contentTypeOptions: 'nosniff',
  contentSecurityPolicy: {
    'base-uri': "'none'",
    'child-src': "'none'",
    'connect-src': [
      "'self'",
      CODESETS_BASE_URL,
      'https://fonts.googleapis.com/',
    ],
    'default-src': "'self'",
    'font-src': ["'self'", 'https://fonts.gstatic.com/'],
    'form-action': "'self'",
    'frame-ancestors': "'none'",
    'frame-src': "'none'",
    'img-src': "'self'",
    'manifest-src': "'self'",
    'media-src': "'self'",
    'object-src': "'none'",
    'prefetch-src': false,
    'script-src': scriptSrcPolicy,
    'style-src': ["'self'", 'https://fonts.googleapis.com/', "'unsafe-inline'"],
    'worker-src': "'self'",
    mergeDefaultDirectives: false,
    reportOnly: false,
  },
  frameOptions: 'DENY',
  permissionsPolicy: false,
  permissionsPolicyDirectiveSupport: ['proposed', 'standard'],
  referrerPolicy: 'no-referrer',
  xssProtection: '1; mode=block',
};

const nextConfig = {
  reactStrictMode: false,
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'route.ts'],
  transpilePackages: ['af-shared'],
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: nextSafe(nextSafeConfig),
      },
    ];
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
    config.plugins.push(new webpack.EnvironmentPlugin(dotenv.parsed || {}));

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
