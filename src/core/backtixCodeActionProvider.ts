'use strict';

import * as vscode from 'vscode';
import * as ts from "typescript";

import { convertTemplateExpressions } from './converters/templateExpressionConverter';
import { convertStringLiterals, convertNoSubstitutionTemplateLiterals } from './converters/simpleLiteralConverters';

import { createSourceFile, retrieveNodes } from './utils/common.utils';
import { convertToDiagnostic, convertToDiagnosticFromCode } from './utils/diagnostic.utils';
import { getTemplateLiteralParts } from './utils/placeholder.utils';
import { getTargetMessages, getTargetStringTypes } from './utils/settings.utils';

import { StringType, DiagnosticCodes } from './models/constants';
import { ExtensionSettings, PlaceholderSettings } from './models/extensionSettings';
import { NodeReplacement } from './models/nodeReplacement';

export class BacktixCodeActionProvider implements vscode.CodeActionProvider {

  private static convertBackticksCommandId = 'backtix.convertBackticks';
  private static convertSingleQuotesCommandId = 'backtix.convertSingleQuotes';
  private static convertDoubleQuotesCommandId = 'backtix.convertDoubleQuotes';
  private static addPlaceholderCommandId = 'backtix.addPlaceholder';
  private convertBackticksCommand!: vscode.Disposable;
  private convertSingleQuotesCommand!: vscode.Disposable;
  private convertDoubleQuotesCommand!: vscode.Disposable;
  private addPlaceholderCommand!: vscode.Disposable;

  private diagnosticCollection!: vscode.DiagnosticCollection;

  private readonly targets: StringType[];

  private readonly targetMessages: { [t in StringType]: string };

  private readonly placeholderSettings: PlaceholderSettings;

  private readonly syntaxKinds: { [kind in ts.SyntaxKind]?: boolean } = {
    [ts.SyntaxKind.StringLiteral]: true,
    [ts.SyntaxKind.NoSubstitutionTemplateLiteral]: true,
    [ts.SyntaxKind.TemplateExpression]: true
  };

  constructor(private readonly settings: ExtensionSettings) {
    this.targetMessages = getTargetMessages(settings.conversionTexts);
    this.targets = getTargetStringTypes(settings.conversions);
    this.placeholderSettings = settings.placeholders;
  }

  public activate(subscriptions: vscode.Disposable[]): void {
    this.convertBackticksCommand = vscode.commands.registerTextEditorCommand(
      BacktixCodeActionProvider.convertBackticksCommandId,
      this.runConvertBackticksCodeAction,
      this);
    this.convertSingleQuotesCommand = vscode.commands.registerTextEditorCommand(
      BacktixCodeActionProvider.convertSingleQuotesCommandId,
      this.runConvertSingleQuotesCodeAction,
      this);
    this.convertDoubleQuotesCommand = vscode.commands.registerTextEditorCommand(
      BacktixCodeActionProvider.convertDoubleQuotesCommandId,
      this.runConvertDoubleQuotesCodeAction,
      this);
    this.addPlaceholderCommand = vscode.commands.registerTextEditorCommand(
      BacktixCodeActionProvider.addPlaceholderCommandId,
      this.runAddPlaceholderCodeAction,
      this);

    subscriptions.push(this);

    this.diagnosticCollection = vscode.languages.createDiagnosticCollection();

    this.registerEventHandlers(subscriptions);

    vscode.workspace.textDocuments.forEach(this.updateDiagnosticCollection, this);
  }

  public dispose(): void {
    this.diagnosticCollection.clear();
    this.diagnosticCollection.dispose();
    this.convertBackticksCommand.dispose();
    this.convertSingleQuotesCommand.dispose();
    this.convertDoubleQuotesCommand.dispose();
    this.addPlaceholderCommand.dispose();
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.Command[] {
    return context.diagnostics.map(diagnostic => ({
      title: diagnostic.message,
      command: this.getCommandId(diagnostic),
      arguments: [diagnostic]
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

    const templateExpressionParts = getTemplateLiteralParts(nodes);
    const placeholderDiagnostics = this.placeholderSettings.active
      ? templateExpressionParts.map(node =>
        convertToDiagnosticFromCode(textDocument, node, this.placeholderSettings.text, DiagnosticCodes.ADD_PLACEHOLDER))
      : [];

    this.diagnosticCollection.set(textDocument.uri, diagnostics.concat(placeholderDiagnostics));
  }

  private getCommandId(diagnostic: vscode.Diagnostic): string {
    switch (diagnostic.message) {
      case this.placeholderSettings.text:
        return BacktixCodeActionProvider.addPlaceholderCommandId;

      case this.targetMessages[StringType.TEMPLATE_LITERAL]:
        return BacktixCodeActionProvider.convertBackticksCommandId;

      case this.targetMessages[StringType.SINGLE_QUOTE]:
        return BacktixCodeActionProvider.convertSingleQuotesCommandId;

      case this.targetMessages[StringType.DOUBLE_QUOTE]:
        return BacktixCodeActionProvider.convertDoubleQuotesCommandId;

      default:
        throw new Error('No command id found!');
    }
  }

  private runConvertBackticksCodeAction(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, diagnostic?: vscode.Diagnostic): void {
    this.applyDiagnostic(edit, diagnostic ?? this.getConvertDiagnostic(textEditor, StringType.TEMPLATE_LITERAL));
  }

  private runConvertSingleQuotesCodeAction(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, diagnostic?: vscode.Diagnostic): void {
    this.applyDiagnostic(edit, diagnostic ?? this.getConvertDiagnostic(textEditor, StringType.SINGLE_QUOTE));
  }

  private runConvertDoubleQuotesCodeAction(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, diagnostic?: vscode.Diagnostic): void {
    this.applyDiagnostic(edit, diagnostic ?? this.getConvertDiagnostic(textEditor, StringType.DOUBLE_QUOTE));
  }

  private runAddPlaceholderCodeAction(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, diagnostic?: vscode.Diagnostic): void {
    diagnostic ??= this.getPlaceholderDiagnostic(textEditor);

    const edits: { range: vscode.Range, replacement: string }[] = [];

    if (!diagnostic) {
      diagnostic = this.getConvertDiagnostic(textEditor, StringType.TEMPLATE_LITERAL);

      if (!diagnostic) {
        return;
      }

      const { start, end } = diagnostic.range;
      const replacement = diagnostic.code as string;

      const firstRange = new vscode.Range(start, start.translate(0, 1));
      const lastRange = new vscode.Range(end.translate(0, -1), end);

      edits.push({ range: firstRange, replacement: replacement[0] });
      edits.push({ range: lastRange, replacement: replacement.slice(-1) });
    }

    const currentSelections = textEditor.selections;

    const startToken = '${';
    const endToken = '}';

    const primarySelection = currentSelections.shift();

    if (!primarySelection) {
      return;
    }

    const range = diagnostic.range.intersection(primarySelection);

    if (!range) {
      return;
    }

    const primarySelectedText = textEditor.document.getText(range);

    const replacement = `${startToken}${primarySelectedText}${endToken}`;

    edits.push({ range, replacement });

    const newFirst = new vscode.Selection(
      new vscode.Position(primarySelection.anchor.line, primarySelection.anchor.character + startToken.length),
      new vscode.Position(primarySelection.active.line, primarySelection.active.character + startToken.length)
    );

    currentSelections.unshift(newFirst);

    textEditor
      .edit(e => edits.forEach(({ range, replacement }) => e.replace(range, replacement)))
      .then(() => textEditor.selections = currentSelections);
  }

  private applyDiagnostic(edit: vscode.TextEditorEdit, diagnostic?: vscode.Diagnostic): void {
    if (!diagnostic) {
      return;
    }

    const range = diagnostic.range;
    const replacement = diagnostic.code as string;

    edit.replace(range, replacement);
  }

  private getConvertDiagnostic(textEditor: vscode.TextEditor, stringType: StringType): vscode.Diagnostic | undefined {
    return this.getDiagnostic(textEditor, this.targetMessages[stringType]);
  }

  private getPlaceholderDiagnostic(textEditor: vscode.TextEditor): vscode.Diagnostic | undefined {
    return this.getDiagnostic(textEditor, this.placeholderSettings.text);
  }

  private getDiagnostic(textEditor: vscode.TextEditor, message: string): vscode.Diagnostic | undefined {
    return this.diagnosticCollection
      .get(textEditor.document.uri)
      ?.filter(d => d.message === message)
      .filter(d => d.range.intersection(textEditor.selection))
      ?.[0];
  }
}
