# Change Log
## Version 3.0.2 (2025-05-29)
- Upgrade packages

## Version 3.0.1 (2025-02-22)
- Update README
- Bump braces from 3.0.2 to 3.0.3

## Version 3.0.0 (2025-02-22)
- Convert BackTix to being a web extension
- Upgrade Chai to version 5

## Version 2.2.2 (2025-02-22)
- Upgrade packages

## Version 2.2.1 (2024-04-22)
- Upgrade packages

## Version 2.2.0 (2024-02-27)
- Switch to new method for executing extension tests

## Version 2.1.3 (2024-02-27)
- Upgrade packages

## Version 2.1.2 (2023-06-11)
- Upgrade packages

## Version 2.1.1 (2023-04-20)
- Upgrade packages

## Version 2.1.0 (2022-11-25)
- Set quick fix code action kind to "Rewrite"

## Version 2.0.5 (2022-11-25)
- Upgrade packages

## Version 2.0.4 (2022-08-01)
- Upgrade packages

## Version 2.0.3 (2022-05-29)
- Upgrade packages

## Version 2.0.2 (2022-04-05)
- Explicitly set [`untrustedWorkspaces` capability][u_1.56_1]
- Upgrade packages, fix breaking changes

## Version 2.0.1 (2021-05-11)
- Explicitly set [`virtualWorkspaces` capability][u_1.56_1]
- Add integration tests

## Version 2.0.0 (2021-04-29)
- Support converting strings and adding placeholders via command palette / keyboard shortcut ([#4][i4])

## Version 1.2.0 (2021-04-09)
- Update project structure, upgrade packages.
- Build, test, package and publish extension using GitHub Actions.

## Version 1.1.1 (2018-08-26)
- Update README.

## Version 1.1.0 (2018-08-25)
- Add option to add a placeholder in template literals via quick fix.
- Do not replace line breaks with a single space when converting multiline template literals, inline them instead.

## Version 1.0.2 (2018-08-18)
- Add GIFs to README.
- Set the cursor positions/text selections back to where they were prior to converting.
- Escape/unescape quote characters in template literals containing placeholders. ([#1][i1])

## Version 1.0.1 (2018-08-18)
- Add `typescript` as a dependency

## Version 1.0.0 (2018-08-18)
- Initial release
- Support for converting between backticks, single and double quotes in any direction
- Settings for individually enabling/disabling
  - offered conversions (backticks/single quotes/double quotes)
  - supported languages (javascript/javascriptreact/typescript/typescriptreact)
- Option to customize quick fix tooltip messages



[i1]: https://github.com/adiessl/vscode-backtix/issues/1
[i4]: https://github.com/adiessl/vscode-backtix/issues/4

[u_1.56_1]: https://code.visualstudio.com/updates/v1_56#_define-whether-your-extension-supports-a-virtual-workspace
[u_1.56_2]: https://code.visualstudio.com/updates/v1_56#_workspace-trust-extension-api
