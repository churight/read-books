const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preser:"ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/src/backend/models/$1',
  },
  testMatch: ['**/tests/**/*.test.ts']
};