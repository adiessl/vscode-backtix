import * as ts from "typescript";
import * as vscode from 'vscode';

import { StringType } from "../models/constants";
import { NodeReplacement } from "../models/nodeReplacement";

export function createSourceFile(textDocument: vscode.TextDocument): ts.SourceFile {
  return ts.createSourceFile(textDocument.fileName, textDocument.getText(), ts.ScriptTarget.Latest, true);
}

export function retrieveNodes(sourceFile: ts.SourceFile, syntaxKinds: { [kind in ts.SyntaxKind]?: boolean }): ts.Node[] {
  const matchedNodes: ts.Node[] = [];

  function filterStringNodes(node: ts.Node) {
    if (!!syntaxKinds[node.kind]) {
      matchedNodes.push(node);
    }

    ts.forEachChild(node, filterStringNodes);
  }

  filterStringNodes(sourceFile);

  return matchedNodes;
}

export function convertToDiagnostic(textDocument: vscode.TextDocument, replacement: NodeReplacement, messages: { [t in StringType]: string }): vscode.Diagnostic {
  const node = replacement.node;

  const start = textDocument.positionAt(node.getStart());
  const end = textDocument.positionAt(node.getEnd());

  const range = new vscode.Range(start, end);

  const diagnostic = new vscode.Diagnostic(range, messages[replacement.targetType], vscode.DiagnosticSeverity.Hint);
  diagnostic.code = replacement.replacement;

  return diagnostic;
}
