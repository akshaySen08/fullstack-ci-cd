import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    include: ["tests/**/*.test.ts"],

    clearMocks: true,

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "json",
        "html",
      ],

      reportsDirectory: "coverage",

      include: ["src/**/*.ts"],

      exclude: [
        "src/server.ts",
      ],
    },
  },
});