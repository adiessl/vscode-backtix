import * as vscode from 'vscode';

import { expect } from 'chai';

import * as testUtils from './test-utils';

suite('integration', () => {
    test('extension should be started', () => {
        const extension = vscode.extensions.getExtension('adiessl.vscode-backtix');

        expect(extension).not.to.be.undefined;
    });

    suite('diagnostics should be available', () => {
        suiteSetup(async () => await testUtils.createTextDocument('setup suite', undefined));

        teardown(async () => await vscode.commands.executeCommand('workbench.action.closeActiveEditor'));

        test('single quoted string', async () => {
            const document = await testUtils.createTextDocument(`const s = 'Testing';`);

            const commands: vscode.Command[] | undefined = await vscode.commands.executeCommand(
                'vscode.executeCodeActionProvider',
                document.uri,
                new vscode.Selection(0, 0, 0, 15)
            );

            expect(commands).not.to.be.undefined;
            expect(commands).to.deep.contain(testUtils.createConvertCommand('backtix.convertBackticks', 'Convert to backticks', '`Testing`'));
            expect(commands).to.deep.contain(testUtils.createConvertCommand('backtix.convertDoubleQuotes', 'Convert to double quotes', `"Testing"`));
            expect(commands).to.not.deep.contain(testUtils.createConvertCommand('backtix.convertSingleQuotes', 'Convert to single quotes', `'Testing'`));
            expect(commands).to.not.deep.contain(testUtils.createPlaceholderCommand());
        }).timeout(10000);

        test('double quoted string', async () => {
            const document = await testUtils.createTextDocument('const s = "Testing";');

            const commands: vscode.Command[] | undefined = await vscode.commands.executeCommand(
                'vscode.executeCodeActionProvider',
                document.uri,
                new vscode.Selection(0, 0, 0, 15)
            );

            expect(commands).not.to.be.undefined;
            expect(commands).to.deep.contain(testUtils.createConvertCommand('backtix.convertBackticks', 'Convert to backticks', '`Testing`'));
            expect(commands).to.deep.contain(testUtils.createConvertCommand('backtix.convertSingleQuotes', 'Convert to single quotes', `'Testing'`));
            expect(commands).to.not.deep.contain(testUtils.createConvertCommand('backtix.convertDoubleQuotes', 'Convert to double quotes', `"Testing"`));
            expect(commands).to.not.deep.contain(testUtils.createPlaceholderCommand());
        }).timeout(10000);

        test('template string', async () => {
            const document = await testUtils.createTextDocument('const s = `Testing`;');

            const commands: vscode.Command[] | undefined = await vscode.commands.executeCommand(
                'vscode.executeCodeActionProvider',
                document.uri,
                new vscode.Selection(0, 0, 0, 15)
            );

            expect(commands).not.to.be.undefined;
            expect(commands).to.deep.contain(testUtils.createConvertCommand('backtix.convertSingleQuotes', 'Convert to single quotes', `'Testing'`));
            expect(commands).to.deep.contain(testUtils.createConvertCommand('backtix.convertDoubleQuotes', 'Convert to double quotes', `"Testing"`));
            expect(commands).to.not.deep.contain(testUtils.createConvertCommand('backtix.convertBackticks', 'Convert to backticks', '`Testing`'));
            expect(commands).to.deep.contain(testUtils.createPlaceholderCommand());
        }).timeout(10000);
    });
});
