import * as assert from 'assert';
import * as ts from 'typescript';
import { getTemplateLiteralParts } from '../../core/utils/placeholder.utils';

suite('placeholder.utils.test', function () {
  suite('getTemplateLiteralParts', function () {
    test('should return empty array if nodes is empty', function () {
      const actual = getTemplateLiteralParts([]);
      assert.deepStrictEqual(actual, []);
    });

    test('should ignore nodes that are not template literals or expressions', function () {
      const nodes = [
        ts.factory.createIdentifier('test'),
        ts.factory.createNumericLiteral('123'),
        ts.factory.createStringLiteral('test string')
      ];

      const actual = getTemplateLiteralParts(nodes);
      assert.deepStrictEqual(actual, []);
    });

    test('should return only the node itself if it is a NoSubstitutionTemplateLiteral', function () {
      const noSub = ts.factory.createNoSubstitutionTemplateLiteral('test');
      const actual = getTemplateLiteralParts([noSub]);

      assert.deepStrictEqual(actual, [noSub]);
    });

    test('should extract the head and all span literals from a TemplateExpression', function () {
      const head = ts.factory.createTemplateHead('head');
      const spanLiteral1 = ts.factory.createTemplateMiddle('middle');
      const spanLiteral2 = ts.factory.createTemplateTail('tail');

      const tempExpr = ts.factory.createTemplateExpression(
        head,
        [
          ts.factory.createTemplateSpan(
            ts.factory.createIdentifier('expr1'),
            spanLiteral1
          ),
          ts.factory.createTemplateSpan(
            ts.factory.createIdentifier('expr2'),
            spanLiteral2
          )
        ]
      );

      const actual = getTemplateLiteralParts([tempExpr]);

      // Result should be the head, then the first span's literal, then the second span's literal.
      assert.deepStrictEqual(actual, [head, spanLiteral1, spanLiteral2]);
    });

    test('should handle a mix of NoSubstitutionTemplateLiteral, TemplateExpression, and unrelated nodes', function () {
      const unrelated = ts.factory.createIdentifier('unrelated');
      const noSub = ts.factory.createNoSubstitutionTemplateLiteral('test');

      const head = ts.factory.createTemplateHead('head');
      const spanLiteral = ts.factory.createTemplateTail('tail');
      const tempExpr = ts.factory.createTemplateExpression(
        head,
        [
          ts.factory.createTemplateSpan(
            ts.factory.createIdentifier('expr'),
            spanLiteral
          )
        ]
      );

      // Pass nodes in order: tempExpr, unrelated, noSub
      const actual = getTemplateLiteralParts([tempExpr, unrelated, noSub]);

      // Result combines the expression parts first, then the noSubstitution literals
      // Since map/filter process sequentially for each type, let's verify exact order:
      // The code does:
      // const noSub = nodes.filter(isNoSubstitutionTemplateLiteral)
      // const tempExprParts = nodes.filter(isTemplateExpression).map(...).reduce(...)
      // return tempExprParts.concat(noSub);

      assert.deepStrictEqual(actual, [head, spanLiteral, noSub]);
    });
  });
});
