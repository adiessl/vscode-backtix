import * as vscode from 'vscode';

import { expect } from 'chai';

import * as testUtils from './test-utils';

suite('integration', function() {
    test('extension should be started', function() {
        const extension = vscode.extensions.getExtension('adiessl.vscode-backtix');

        expect(extension).not.to.be.undefined;
    });

    suite('diagnostics should be available', function() {
        const setup = (context: Mocha.Context) => {
            context.timeout(10000);
            context.retries(3);
        };

        suiteSetup(async () => await testUtils.createTextDocument('setup suite', undefined));

        teardown(async () => await vscode.commands.executeCommand('workbench.action.closeActiveEditor'));

        test('single quoted string', async function() {
            setup(this);

            const document = await testUtils.createTextDocument(`const s = 'Testing';`);

            const commands: vscode.Command[] | undefined = await vscode.commands.executeCommand(
                'vscode.executeCodeActionProvider',
                document.uri,
                new vscode.Selection(0, 0, 0, 15)
            );

            expect(commands).not.to.be.undefined;
            expect(commands).to.deep.contain(testUtils.createConvertCodeAction('backtix.convertBackticks', 'Convert to backticks', '`Testing`'));
            expect(commands).to.deep.contain(testUtils.createConvertCodeAction('backtix.convertDoubleQuotes', 'Convert to double quotes', `"Testing"`));
            expect(commands).to.not.deep.contain(testUtils.createConvertCodeAction('backtix.convertSingleQuotes', 'Convert to single quotes', `'Testing'`));
            expect(commands).to.not.deep.contain(testUtils.createPlaceholderCodeAction());
        });

        test('double quoted string', async function() {
            setup(this);

            const document = await testUtils.createTextDocument('const s = "Testing";');

            const commands: vscode.Command[] | undefined = await vscode.commands.executeCommand(
                'vscode.executeCodeActionProvider',
                document.uri,
                new vscode.Selection(0, 0, 0, 15)
            );

            expect(commands).not.to.be.undefined;
            expect(commands).to.deep.contain(testUtils.createConvertCodeAction('backtix.convertBackticks', 'Convert to backticks', '`Testing`'));
            expect(commands).to.deep.contain(testUtils.createConvertCodeAction('backtix.convertSingleQuotes', 'Convert to single quotes', `'Testing'`));
            expect(commands).to.not.deep.contain(testUtils.createConvertCodeAction('backtix.convertDoubleQuotes', 'Convert to double quotes', `"Testing"`));
            expect(commands).to.not.deep.contain(testUtils.createPlaceholderCodeAction());
        });

        test('template string', async function() {
            setup(this);

            const document = await testUtils.createTextDocument('const s = `Testing`;');

            const commands: vscode.Command[] | undefined = await vscode.commands.executeCommand(
                'vscode.executeCodeActionProvider',
                document.uri,
                new vscode.Selection(0, 0, 0, 15)
            );

            expect(commands).not.to.be.undefined;
            expect(commands).to.deep.contain(testUtils.createConvertCodeAction('backtix.convertSingleQuotes', 'Convert to single quotes', `'Testing'`));
            expect(commands).to.deep.contain(testUtils.createConvertCodeAction('backtix.convertDoubleQuotes', 'Convert to double quotes', `"Testing"`));
            expect(commands).to.not.deep.contain(testUtils.createConvertCodeAction('backtix.convertBackticks', 'Convert to backticks', '`Testing`'));
            expect(commands).to.deep.contain(testUtils.createPlaceholderCodeAction());
        });
    });
});
