export default {
  moduleFileExtensions: ['js', 'json', 'ts', 'feature'],
  rootDir: '.',
  testEnvironment: 'node',

  // Ejecuta los archivos .spec.ts dentro de la carpeta test
  testMatch: [
    // '<rootDir>/test/**/*.spec.ts',
      '<rootDir>/test/**/*.steps.ts'

  ],
  verbose: true,        // muestra escenarios
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },

  testPathIgnorePatterns: ['<rootDir>/src/', 'users.controller.spec.ts', 'users.controller.feature'],

collectCoverageFrom: [
  '**/*.service.ts', // solo estos tipos
  '!src/main.ts',                               // bootstrap
  '!src/**/dto/*.ts',                           // excluye DTOs
  '!src/**/entities/*.ts',                      // excluye entidades
  '!src/**/interfaces/*.ts'                     // excluye interfaces
],
coveragePathIgnorePatterns: [
  "/node_modules/",
  "src/main.ts",
  "src/app.module.ts",
  "src/config/",
  "src/common/",
  "src/app.controller.ts",
  "src/app.service.ts",
  "src/auth/"
],
  coverageDirectory: './coverage'
};
