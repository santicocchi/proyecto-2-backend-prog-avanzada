/ @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['/.steps.ts', '**/.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
};