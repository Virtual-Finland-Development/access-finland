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
    '^@shared/components/(.*)$': 'af-shared/src/components/$1',
    '^@shared/types/(.*)$': 'af-shared/src/types/$1',
    '^@shared/types': 'af-shared/src/types',
    '^@shared/lib/(.*)$': 'af-shared/src/lib/$1',
    '^@shared/context/(.*)$': 'af-shared/src/context/$1',
    '^@/components/(.*)$': 'af-shared/src/components/$1',
    '^@/types/(.*)$': 'af-shared/src/types/$1',
    '^@/types': 'af-shared/src/types',
    '^@/lib/(.*)$': 'af-shared/src/lib/$1',
    '^@/context/(.*)$': 'af-shared/src/context/$1',
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
