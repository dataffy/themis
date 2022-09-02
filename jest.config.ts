import { pathsToModuleNameMapper } from "ts-jest";
import tsconfig from "./tsconfig.json";

module.exports = {
  clearMocks: true,
  restoreMocks: true,
  maxWorkers: 1,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: "<rootDir>/" }),
  coveragePathIgnorePatterns: ["./node_modules", "./tests"],
  collectCoverage: true,
  reporters: ["default"],
};
