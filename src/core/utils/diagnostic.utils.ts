import * as ts from "typescript";
import * as vscode from 'vscode';

import { StringType } from "../models/constants";
import { NodeReplacement } from "../models/nodeReplacement";

export function convertToDiagnostic(
  textDocument: vscode.TextDocument,
  replacement: NodeReplacement,
  messages: { [t in StringType]: string }
): vscode.Diagnostic {
  const range = getDocumentRange(textDocument, replacement.node);

  const diagnostic = new vscode.Diagnostic(range, messages[replacement.targetType], vscode.DiagnosticSeverity.Hint);
  diagnostic.code = replacement.replacement;

  return diagnostic;
}

function getDocumentRange(textDocument: vscode.TextDocument, node: ts.Node): vscode.Range {
  const start = textDocument.positionAt(node.getStart());
  const end = textDocument.positionAt(node.getEnd());

  return new vscode.Range(start, end);
}
