
const globals = require("globals");
const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const nextPlugin = require("@next/eslint-plugin-next");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/*.lock",
      "**/*.d.ts",
      "**/*.md",
      "**/*.txt",
      "**/*.log",
      "**/*.config.*",
      "frontend/src/app/globals.css",
      "frontend/next-env.d.ts",
      "tailwind.config.ts",
      "backend/package-lock.json",
      "package-lock.json",
      "postcss.config.cjs",
      "eslint.config.mjs"
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
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["frontend/**/*.ts", "frontend/**/*.tsx"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./frontend/tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        process: "readonly",
        React: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
      next: { rootDir: "frontend/" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-undef": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  prettier,
];
