const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@shared/components/(.*)$': 'vf-shared/src/components/$1',
    '^@shared/types/(.*)$': 'vf-shared/src/types/$1',
    '^@shared/lib/(.*)$': 'vf-shared/src/lib/$1',
    '^@shared/context/(.*)$': 'vf-shared/src/context/$1',
    '^@/components/(.*)$': 'vf-shared/src/components/$1',
    '^@/types/(.*)$': 'vf-shared/src/types/$1',
    '^@/types': 'vf-shared/src/types',
    '^@/lib/(.*)$': 'vf-shared/src/lib/$1',
    '^@/context/(.*)$': 'vf-shared/src/context/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': [
      'babel-jest',
      {
        presets: [['next/babel']],
        plugins: [require.resolve('babel-plugin-macros')],
        env: {
          test: {
            plugins: ['transform-dynamic-import'],
          },
        },
      },
    ],
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
