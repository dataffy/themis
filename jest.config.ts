module.exports = {
  clearMocks: true,
  restoreMocks: true,
  maxWorkers: 1,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  coveragePathIgnorePatterns: ["./node_modules", "./tests"],
  collectCoverage: true,
  reporters: ["default"],
};
