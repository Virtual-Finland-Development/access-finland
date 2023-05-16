// Configure or set up a testing framework before each test.
import '@testing-library/jest-dom/extend-expect';
// msw settings
import server from 'vf-shared/src/lib/testing/mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

// clear all mocks after each
afterEach(() => {
  jest.clearAllMocks();
});

// mock next/router
jest.mock('next/router', () => require('next-router-mock'));
