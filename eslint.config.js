import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/dist/*",
      "**/node_modules/*",
      "**/.next/*",
      "**/*-lock.json",
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
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./frontend/tsconfig.json",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
        react: { version: "detect" },
        next: { rootDir: "frontend/" }
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  prettier,
];
