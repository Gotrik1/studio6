
import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    ignores: [
      "**/dist/*",
      "**/node_modules/*",
      "**/.next/*",
      "**/package-lock.json",
      "**/*-lock.json",
      "**/.firebasestudioignore",
      "frontend/src/app/globals.css",
      "frontend/next-env.d.ts",
      "backend/package-lock.json",
    ],
  },
  js.configs.recommended,
  {
    files: ["backend/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./backend/tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    files: ["frontend/**/*.ts", "frontend/**/*.tsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    settings: {
      next: {
        rootDir: "frontend/",
      },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./frontend/tsconfig.json",
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  prettier,
];
