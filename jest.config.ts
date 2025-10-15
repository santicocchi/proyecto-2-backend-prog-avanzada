export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',          // excluye bootstrap
    '!src/**/dto/*.ts',      // excluye DTOs
    '!src/**/entities/*.ts', // excluye entidades
    '!src/**/interfaces/*.ts',
  ],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
