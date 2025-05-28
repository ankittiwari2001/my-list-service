module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup-env.ts'],
  testTimeout: 30000, // ✅ Increase timeout to 30s
};
