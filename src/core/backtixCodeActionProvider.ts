'use strict';

import * as vscode from 'vscode';
import * as ts from "typescript";

import { convertTemplateExpressions } from './converters/templateExpressionConverter';
import { convertStringLiterals, convertNoSubstitutionTemplateLiterals } from './converters/simpleLiteralConverters';

import { createSourceFile, retrieveNodes, convertToDiagnostic } from './utils/common.utils';
import { getTargetMessages, getTargetStringTypes } from './utils/settings.utils';

import { StringType } from './models/constants';
import { ExtensionSettings } from './models/extensionSettings';
import { NodeReplacement } from './models/nodeReplacement';

export class BacktixCodeActionProvider implements vscode.CodeActionProvider {

  private static commandId: string = 'backtix.convert';
  private command!: vscode.Disposable;
  private diagnosticCollection!: vscode.DiagnosticCollection;

  private readonly targets: StringType[];

  private readonly targetMessages: { [t in StringType]: string };

  private readonly syntaxKinds: { [kind in ts.SyntaxKind]?: boolean } = {
    [ts.SyntaxKind.StringLiteral]: true,
    [ts.SyntaxKind.NoSubstitutionTemplateLiteral]: true,
    [ts.SyntaxKind.TemplateExpression]: true
  };

  constructor(private readonly settings: ExtensionSettings) {
    this.targetMessages = getTargetMessages(settings.conversionTexts);
    this.targets = getTargetStringTypes(settings.conversions);
  }

  public activate(subscriptions: vscode.Disposable[]) {
    this.command = vscode.commands.registerCommand(BacktixCodeActionProvider.commandId, this.runCodeAction, this);
    subscriptions.push(this);
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

    this.registerEventHandlers(subscriptions);

    vscode.workspace.textDocuments.forEach(this.updateDiagnosticCollection, this);
  }

  public dispose(): void {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.command.dispose();
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.Command[] {
    return context.diagnostics.map(diagnostic => ({
      title: diagnostic.message,
      command: BacktixCodeActionProvider.commandId,
      arguments: [document, diagnostic]
    }));
  }

  private registerEventHandlers(subscriptions: vscode.Disposable[]) {
    vscode.workspace.onDidOpenTextDocument(this.updateDiagnosticCollection, this, subscriptions);
    vscode.workspace.onDidChangeTextDocument(
      (e: vscode.TextDocumentChangeEvent) => this.updateDiagnosticCollection(e.document), this, subscriptions);
    vscode.workspace.onDidCloseTextDocument(
      (textDocument) => this.diagnosticCollection.delete(textDocument.uri), null, subscriptions);
  }

  private updateDiagnosticCollection(textDocument: vscode.TextDocument) {
    if (!this.settings.languages[textDocument.languageId]) {
      return;
    }

    const sourceFile = createSourceFile(textDocument);
    const nodes = retrieveNodes(sourceFile, this.syntaxKinds);

    const replacements = new Array<NodeReplacement>()
      .concat(convertTemplateExpressions(nodes, this.targets))
      .concat(convertNoSubstitutionTemplateLiterals(nodes, this.targets))
      .concat(convertStringLiterals(nodes, this.targets));

    const diagnostics = replacements.map(replacement => convertToDiagnostic(textDocument, replacement, this.targetMessages));

    this.diagnosticCollection.set(textDocument.uri, diagnostics);
  }

  private runCodeAction(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): any {
    const currentSelections = this.selections;

    const range = diagnostic.range;
    const replacement = diagnostic.code as string;

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, replacement);
    vscode.workspace.applyEdit(edit);

    this.selections = currentSelections;
  }

  private get selections(): vscode.Selection[] | undefined {
    const editor = this.activeEditor;

    return !!editor ? editor.selections : undefined;
  }

  private set selections(selections: vscode.Selection[] | undefined) {
    const editor = this.activeEditor;
    if (!!editor && !!selections) {
      editor.selections = selections;
    }
  }

  private get activeEditor(): vscode.TextEditor | undefined {
    return vscode.window.activeTextEditor;
  }
}
