import * as ts from "typescript";
import * as vscode from 'vscode';

export function createSourceFile(textDocument: vscode.TextDocument): ts.SourceFile {
  return ts.createSourceFile(
    textDocument.fileName,
    textDocument.getText(),
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(textDocument.languageId)
  );
}

export function retrieveNodes(sourceFile: ts.SourceFile, syntaxKinds: { [kind in ts.SyntaxKind]?: boolean }): ts.Node[] {
  const matchedNodes: ts.Node[] = [];

  function filterStringNodes(node: ts.Node) {
    if (syntaxKinds[node.kind]) {
      matchedNodes.push(node);
    }

    ts.forEachChild(node, filterStringNodes);
  }

  filterStringNodes(sourceFile);

  return matchedNodes;
}

function getScriptKind(languageId: string) {
  switch (languageId) {
    case "javascript":
      return ts.ScriptKind.JS;
    case "typescript":
      return ts.ScriptKind.TS;
    case "javascriptreact":
      return ts.ScriptKind.JSX;
    case "typescriptreact":
      return ts.ScriptKind.TSX;
    default:
      return ts.ScriptKind.Unknown;
  }
}
