module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'internal/presentation/**/*.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/integration/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/utils/testSetup.js'],
};