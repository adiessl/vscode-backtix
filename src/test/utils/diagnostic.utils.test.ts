import * as assert from 'assert';
import * as vscode from 'vscode';
import * as ts from 'typescript';
import { convertToDiagnostic } from '../../core/utils/diagnostic.utils';
import { StringType, DiagnosticCodes } from '../../core/models/constants';
import { NodeReplacement } from '../../core/models/nodeReplacement';

suite('diagnostic.utils.test', function () {
  test('convertToDiagnostic should use safe code and store replacement in data', function () {
    const mockDocument: any = {
      positionAt: (offset: number) => new vscode.Position(0, offset)
    };

    const mockNode: any = {
      getStart: () => 0,
      getEnd: () => 5
    };

    const replacement: NodeReplacement = {
      node: mockNode as ts.Node,
      targetType: StringType.TEMPLATE_LITERAL,
      replacement: '`test`'
    };

    const messages = {
      [StringType.TEMPLATE_LITERAL]: 'Convert to backticks',
      [StringType.SINGLE_QUOTE]: 'Convert to single quotes',
      [StringType.DOUBLE_QUOTE]: 'Convert to double quotes'
    };

    const diagnostic = convertToDiagnostic(mockDocument as vscode.TextDocument, replacement, messages);

    assert.strictEqual(diagnostic.code, DiagnosticCodes.CONVERT_STRING, 'Diagnostic code should be CONVERT_STRING');
    assert.strictEqual(diagnostic.data, '`test`', 'Diagnostic data should contain the replacement string');
    assert.strictEqual(diagnostic.message, 'Convert to backticks');
  });
});
