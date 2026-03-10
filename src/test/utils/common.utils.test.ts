import * as assert from 'assert';
import * as ts from 'typescript';
import { retrieveNodes } from '../../core/utils/common.utils';

suite('common.utils.test', function () {
  suite('retrieveNodes', function () {
    test('should return matched nodes for a given syntax kind', function () {
      const code = 'const a = "hello";';
      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest, true);

      const matchedNodes = retrieveNodes(sourceFile, { [ts.SyntaxKind.StringLiteral]: true });

      assert.strictEqual(matchedNodes.length, 1);
      assert.strictEqual(matchedNodes[0].kind, ts.SyntaxKind.StringLiteral);
      assert.strictEqual((matchedNodes[0] as ts.StringLiteral).text, 'hello');
    });

    test('should return multiple matched nodes', function () {
      const code = 'const a = "hello"; const b = "world";';
      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest, true);

      const matchedNodes = retrieveNodes(sourceFile, { [ts.SyntaxKind.StringLiteral]: true });

      assert.strictEqual(matchedNodes.length, 2);
      assert.strictEqual((matchedNodes[0] as ts.StringLiteral).text, 'hello');
      assert.strictEqual((matchedNodes[1] as ts.StringLiteral).text, 'world');
    });

    test('should return empty array if no nodes match', function () {
      const code = 'const a = 1;';
      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest, true);

      const matchedNodes = retrieveNodes(sourceFile, { [ts.SyntaxKind.StringLiteral]: true });

      assert.strictEqual(matchedNodes.length, 0);
    });

    test('should match multiple syntax kinds', function () {
      const code = 'const a = "hello"; let b = 1;';
      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest, true);

      const matchedNodes = retrieveNodes(sourceFile, {
        [ts.SyntaxKind.StringLiteral]: true,
        [ts.SyntaxKind.NumericLiteral]: true
      });

      assert.strictEqual(matchedNodes.length, 2);
      const kinds = matchedNodes.map(n => n.kind);
      assert.ok(kinds.includes(ts.SyntaxKind.StringLiteral));
      assert.ok(kinds.includes(ts.SyntaxKind.NumericLiteral));
    });

    test('should traverse nested nodes', function () {
      const code = 'function foo() { const a = "hello"; }';
      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest, true);

      const matchedNodes = retrieveNodes(sourceFile, { [ts.SyntaxKind.StringLiteral]: true });

      assert.strictEqual(matchedNodes.length, 1);
      assert.strictEqual((matchedNodes[0] as ts.StringLiteral).text, 'hello');
    });
  });
});
