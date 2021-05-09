
import * as vscode from 'vscode';

import { DiagnosticCodes } from '../../core/models/constants';

export const createTextDocument = async (content: string, language = 'typescript'): Promise<vscode.TextDocument> => {
    const document = await vscode.workspace.openTextDocument({
        language,
        content
    });

    await vscode.window.showTextDocument(document, { preserveFocus: false, preview: false });

    await new Promise(resolve => setTimeout(resolve, 1000));

    return document;
};

export const createConvertCommand = (command: string, title: string, code: string | DiagnosticCodes): vscode.Command => {
    const diagnostic = new vscode.Diagnostic(new vscode.Range(0, 10, 0, 19), title, vscode.DiagnosticSeverity.Hint);
    diagnostic.code = code;

    const createdCommand: vscode.Command = {
        title,
        command,
        arguments: [diagnostic]
    };

    return createdCommand;
};

export const createPlaceholderCommand = (): vscode.Command => createCommand(
    'backtix.addPlaceholder',
    'Add placeholder',
    new vscode.Range(0, 11, 0, 18),
    DiagnosticCodes.ADD_PLACEHOLDER
);

export const createCommand = (command: string, title: string, range: vscode.Range, code: string | DiagnosticCodes): vscode.Command => {
    const diagnostic = new vscode.Diagnostic(range, title, vscode.DiagnosticSeverity.Hint);
    diagnostic.code = code;

    const createdCommand: vscode.Command = {
        title,
        command,
        arguments: [diagnostic]
    };

    return createdCommand;
};
