import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals";
import markdown from "@eslint/markdown";
import json from "@eslint/json";
import css from "@eslint/css";

export default [
  {
    ignores: [
      "**/dist/*",
      "**/node_modules/*",
      "**/.next/*",
      "frontend/src/app/globals.css",
      "**/*-lock.json",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
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
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "error",
    },
  },
  {
    files: ["**/*.md"],
    processor: markdown.processor,
    plugins: {
      markdown,
    },
    rules: {
      "markdown/no-missing-label-refs": "error",
      "markdown/fenced-code-language": "error",
      "markdown/heading-increment": "error",
    },
  },
  {
    files: ["**/*.json"],
    processor: json.processor,
    plugins: {
      json,
    },
    rules: {
      "json/no-empty-keys": "error",
    },
  },
  {
    files: ["**/*.css"],
    processor: css.processor,
    plugins: {
      css,
    },
    rules: {
      "css/no-invalid-at-rules": "error",
      "css/no-invalid-properties": "error",
      "css/use-baseline": "warn",
    },
  },
  prettier,
];
