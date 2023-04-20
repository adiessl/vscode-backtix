
import * as vscode from 'vscode';

import { DiagnosticCodes } from '../../core/models/constants';

export const createTextDocument = async (content: string, language = 'typescript'): Promise<vscode.TextDocument> => {
    const document = await vscode.workspace.openTextDocument({
        language,
        content
    });

    await vscode.window.showTextDocument(document, { preserveFocus: false, preview: false });

    return document;
};

export const createConvertCodeAction = (command: string, title: string, code: string | DiagnosticCodes): vscode.CodeAction => {
    const diagnostic = new vscode.Diagnostic(new vscode.Range(0, 10, 0, 19), title, vscode.DiagnosticSeverity.Hint);
    diagnostic.code = code;

    const createdCodeAction: vscode.CodeAction = {
        title,
        command: createCommand(command, diagnostic),
        isPreferred: false,
        kind: vscode.CodeActionKind.RefactorRewrite
    };

    return createdCodeAction;
};

export const createPlaceholderCodeAction = (): vscode.CodeAction => createCodeAction(
    'backtix.addPlaceholder',
    'Add placeholder',
    new vscode.Range(0, 11, 0, 18),
    DiagnosticCodes.ADD_PLACEHOLDER
);

export const createCodeAction = (command: string, title: string, range: vscode.Range, code: string | DiagnosticCodes): vscode.CodeAction => {
    const diagnostic = new vscode.Diagnostic(range, title, vscode.DiagnosticSeverity.Hint);
    diagnostic.code = code;

    const createdCodeAction: vscode.CodeAction = {
        title,
        command: createCommand(command, diagnostic),
        isPreferred: false,
        kind: vscode.CodeActionKind.RefactorRewrite
    };

    return createdCodeAction;
};

export const createCommand = (command: string, diagnostic: vscode.Diagnostic): vscode.Command => {
    return {
        title: diagnostic.message,
        command,
        arguments: [diagnostic]
    };
};
