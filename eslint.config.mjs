import js from "@eslint/js";
import typescriptESLint from "typescript-eslint";

export default [
    js.configs.recommended,
    ...typescriptESLint.configs.recommended,
    {
        files: ["**/*.ts"],
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
            "@typescript-eslint/semi": "warn",
            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "off"
        },
        ignores: ["**/*.d.ts"]
    }
];
