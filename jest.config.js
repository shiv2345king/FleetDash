const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ["**/src/tests/**/*.test.ts"],
  setupFiles: ["dotenv/config"],
  testTimeout: 15000,
  verbose: true,
  moduleFileExtensions: ["ts", "js", "json"],
};

module.exports = config;