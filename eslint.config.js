import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

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
      "backend/package-lock.json",
      "frontend/next-env.d.ts",
      "next-env.d.ts",
    ],
  },
  js.configs.recommended,
  {
    files: ["backend/**/*.ts", "frontend/**/*.ts", "frontend/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./frontend/tsconfig.json", "./backend/tsconfig.json"],
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  prettier,
];
