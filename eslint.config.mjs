import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';
import typescriptESLint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...typescriptESLint.configs.recommended,
  {
    files: ["**/*.ts"],
    plugins: {
      '@stylistic': stylistic,
      "@typescript-eslint": typescriptESLint.plugin,
    },
    languageOptions: {
      parser: typescriptESLint.parser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "import",
          format: [
            "camelCase",
            "PascalCase"
          ],
        },
        {
          "selector": "enumMember",
          "format": [
            "UPPER_CASE"
          ]
        }
      ],

      curly: "warn",
      eqeqeq: "warn",
      "no-throw-literal": "warn",
      "@stylistic/semi": "warn"
    },
    ignores: ["**/*.d.ts"],
  }
];
