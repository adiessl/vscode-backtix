import * as assert from 'assert';
import * as ts from 'typescript';
import { simpleLiteralConverterFactory } from '../../../core/converters/simpleLiteralConverterFactory';
import { StringType } from '../../../core/models/constants';

suite('simpleLiteralConverterFactory', function () {
  const filterKind = ts.SyntaxKind.StringLiteral;
  const preprocess = (text: string) => text.trim();
  const replaceQuotes = (text: string, quote: string) => {
    // Basic mock: wrap the content (excluding original quotes) with the target quote
    const content = text.slice(1, -1);
    return `${quote}${content}${quote}`;
  };

  const converter = simpleLiteralConverterFactory(filterKind, preprocess, replaceQuotes);

  test('should filter nodes by syntax kind', function () {
    const nodes = [
      { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as any as ts.Node,
      { kind: ts.SyntaxKind.NumericLiteral, getText: () => '123' } as any as ts.Node,
    ];

    const result = converter(nodes, [StringType.DOUBLE_QUOTE]);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].node, nodes[0]);
  });

  test('should apply preprocessing and quote replacement', function () {
    const nodes = [
      { kind: ts.SyntaxKind.StringLiteral, getText: () => "  'test'  " } as any as ts.Node,
    ];

    const result = converter(nodes, [StringType.DOUBLE_QUOTE]);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].replacement, '"test"');
  });

  test('should return multiple replacements if multiple targets are provided', function () {
    const nodes = [
      { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as any as ts.Node,
    ];

    const result = converter(nodes, [StringType.DOUBLE_QUOTE, StringType.TEMPLATE_LITERAL]);

    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].targetType, StringType.DOUBLE_QUOTE);
    assert.strictEqual(result[0].replacement, '"test"');
    assert.strictEqual(result[1].targetType, StringType.TEMPLATE_LITERAL);
    assert.strictEqual(result[1].replacement, '`test`');
  });

  test('should filter out replacements that do not change the text', function () {
    const nodes = [
      { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as any as ts.Node,
    ];

    // Mock replaceQuotes to return same text if it matches a certain condition
    const customReplaceQuotes = (text: string, quote: string) => {
      if (quote === '\'') {
        return text;
      }
      const content = text.slice(1, -1);
      return `${quote}${content}${quote}`;
    };
    const customConverter = simpleLiteralConverterFactory(filterKind, (t) => t, customReplaceQuotes);

    const result = customConverter(nodes, [StringType.SINGLE_QUOTE, StringType.DOUBLE_QUOTE]);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].targetType, StringType.DOUBLE_QUOTE);
    assert.strictEqual(result[0].replacement, '"test"');
  });

  test('should handle empty nodes array', function () {
    const result = converter([], [StringType.DOUBLE_QUOTE]);
    assert.strictEqual(result.length, 0);
  });

  test('should handle no targets', function () {
    const nodes = [
      { kind: ts.SyntaxKind.StringLiteral, getText: () => "'test'" } as any as ts.Node,
    ];
    const result = converter(nodes, []);
    assert.strictEqual(result.length, 0);
  });
});
