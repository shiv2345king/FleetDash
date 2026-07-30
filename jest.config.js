import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

const config: Config = {
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

export default config;