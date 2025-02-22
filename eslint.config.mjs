import js from "@eslint/js";
import typescriptESLint from "typescript-eslint";
import stylistic from '@stylistic/eslint-plugin'

export default [
    js.configs.recommended,
    ...typescriptESLint.configs.recommended,
    {
        files: ["**/*.ts"],
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "warn",
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
        ignores: ["**/*.d.ts"]
    }
];
