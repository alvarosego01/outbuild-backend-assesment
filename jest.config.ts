export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testTimeout: 60000,
};