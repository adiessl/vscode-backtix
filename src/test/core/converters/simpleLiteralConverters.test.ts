import * as assert from 'assert';
import * as ts from 'typescript';
import { convertStringLiterals, convertNoSubstitutionTemplateLiterals } from '../../../core/converters/simpleLiteralConverters';
import { StringType } from '../../../core/models/constants';

suite('simpleLiteralConverters', function () {

  suite('convertStringLiterals', function () {
    test('should correctly identify StringLiteral nodes', function () {
      const nodes = [
        { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as unknown as ts.Node,
        { kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral, getText: () => '`test`' } as unknown as ts.Node,
      ];

      const result = convertStringLiterals(nodes, [StringType.DOUBLE_QUOTE]);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].node, nodes[0]);
    });

    test('should convert single-quoted string to double-quoted string', function () {
      const nodes = [
        { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as unknown as ts.Node,
      ];

      const result = convertStringLiterals(nodes, [StringType.DOUBLE_QUOTE]);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '"test"');
    });

    test('should convert double-quoted string to template literal', function () {
      const nodes = [
        { kind: ts.SyntaxKind.StringLiteral, getText: () => '"test"' } as unknown as ts.Node,
      ];

      const result = convertStringLiterals(nodes, [StringType.TEMPLATE_LITERAL]);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '`test`');
    });
  });

  suite('convertNoSubstitutionTemplateLiterals', function () {
    test('should correctly identify NoSubstitutionTemplateLiteral nodes', function () {
      const nodes = [
        { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as unknown as ts.Node,
        { kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral, getText: () => '`test`' } as unknown as ts.Node,
      ];

      const result = convertNoSubstitutionTemplateLiterals(nodes, [StringType.DOUBLE_QUOTE]);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].node, nodes[1]);
    });

    test('should inline line breaks when converting template literal to single-quoted string', function () {
      const nodes = [
        {
          kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral,
          getText: () => '`line1\nline2`'
        } as unknown as ts.Node,
      ];

      const result = convertNoSubstitutionTemplateLiterals(nodes, [StringType.SINGLE_QUOTE]);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, "'line1\\nline2'");
    });

    test('should convert template literal to double-quoted string', function () {
      const nodes = [
        { kind: ts.SyntaxKind.NoSubstitutionTemplateLiteral, getText: () => '`test`' } as unknown as ts.Node,
      ];

      const result = convertNoSubstitutionTemplateLiterals(nodes, [StringType.DOUBLE_QUOTE]);

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '"test"');
    });
  });
});
