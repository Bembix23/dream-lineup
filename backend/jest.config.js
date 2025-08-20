module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|ts)$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|ts)',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.spec.ts',
  ],
  coverageDirectory: '../coverage',
};