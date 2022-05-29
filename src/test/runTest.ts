import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main(args: string[]) {
    try {
        const version = args[0] ?? 'stable';

        console.log(`Running tests using VS Code version "${version}".`);

        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './index');

        // Download VS Code, unzip it and run the integration test
        await runTests({ extensionDevelopmentPath, extensionTestsPath, version });
    } catch (err) {
        console.error('Failed to run tests', err);
        process.exit(1);
    }
}

main(process.argv.slice(2));
