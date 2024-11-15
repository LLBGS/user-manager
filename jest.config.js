/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!<rootDir>/src/shared/infra/server.ts',
    '!<rootDir>/src/shared/infra/error/**',
    '!<rootDir>/src/shared/infra/mocks/**',
    '!<rootDir>/src/shared/enum/**',
    '!<rootDir>/src/shared/infra/typeorm/migrations/**',
    '!<rootDir>/src/config/**',
    '!<rootDir>/src/**mock/**',
    '!<rootDir>/src/**/middlewares/**',
    '!<rootDir>/src/**/dtos/**',
  ],
  transform: {
    '^.*\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/shared/@types',
    '<rootDir>/dist',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/shared/@types',
    '<rootDir>/dist',
  ],
  coverageReporters: ['text-summary', 'lcov'],
};
