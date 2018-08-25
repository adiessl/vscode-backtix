import * as ts from "typescript";
import * as vscode from 'vscode';

import { StringType, DiagnosticCodes } from "../models/constants";
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

export function convertToDiagnosticFromCode(
  textDocument: vscode.TextDocument,
  node: ts.Node,
  message: string,
  diagnosticCode: DiagnosticCodes
): vscode.Diagnostic {
  const range = getDocumentRange(textDocument, node);

  const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Hint);
  diagnostic.code = diagnosticCode;

  return diagnostic;
}

function getDocumentRange(textDocument: vscode.TextDocument, node: ts.Node, offsets = { start: 0, end: 0 }): vscode.Range {
  const start = textDocument.positionAt(node.getStart() + offsets.start);
  const end = textDocument.positionAt(node.getEnd() + offsets.end);

  return new vscode.Range(start, end);
}
