import * as ts from 'typescript';

import { StringType, StringTypeToQuote } from '../models/constants';
import { NodeReplacement, createNodeReplacement } from '../models/nodeReplacement';
import { wrapText, escapeQuoteChars, replaceLineBreaks } from '../utils/string.utils';

export function convertTemplateExpressions(nodes: ts.Node[], targets: StringType[], link = ' + '): NodeReplacement[] {

  function convertNode(
    node: ts.Node
  ): NodeReplacement[] {
    function processNode(node: ts.Node, quoteChar: string): string {

      function processString(text: string): string {
        return wrapText(
          escapeQuoteChars(
            replaceLineBreaks(text),
            StringTypeToQuote[StringType.TEMPLATE_LITERAL], quoteChar),
          quoteChar
        );
      }

      function processTemplateSpan(span: ts.TemplateSpan): string[] {
        return [span.expression.getText(), processString(span.literal.text)];
      }

      const parts: string[] = [];

      if (ts.isTemplateExpression(node)) {
        parts.push(processString(node.head.text));

        const spans = node.templateSpans
          .map(processTemplateSpan)
          .reduce((acc, cur) => acc.concat(cur), []);

        parts.push(...spans);
      }

      return parts
        .filter(part => part !== wrapText('', quoteChar))
        .join(link);
    }

    return targets
      .filter(target => target !== StringType.TEMPLATE_LITERAL)
      .map(target => [target, processNode(node, StringTypeToQuote[target])] as [StringType, string])
      .map(([target, replaced]) => createNodeReplacement(node, target, replaced));
  }

  return nodes
    .filter(node => node.kind === ts.SyntaxKind.TemplateExpression)
    .map(node => convertNode(node))
    .reduce((acc, cur) => acc.concat(cur), []);
}
