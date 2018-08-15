import * as ts from 'typescript';

import { StringType, StringKindToQuote } from '../models/constants';
import { NodeReplacement, createNodeReplacement } from '../models/nodeReplacement';
import { wrapText } from '../utils/string.utils';

export function convertTemplateExpressions(nodes: ts.Node[], targets: StringType[], link = ' + '): NodeReplacement[] {

  function convertNode(
    node: ts.Node
  ): NodeReplacement[] {
    function processNode(node: ts.Node, quoteChar: string): string {

      function processTemplateSpan(span: ts.TemplateSpan): string[] {
        return [span.expression.getText(), wrapText(span.literal.text, quoteChar)];
      }

      const parts: string[] = [];

      if (ts.isTemplateExpression(node)) {
        parts.push(wrapText(node.head.text, quoteChar));

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
      .map(target => [target, processNode(node, StringKindToQuote[target])] as [StringType, string])
      .map(([target, replaced]) => createNodeReplacement(node, target, replaced));
  }

  return nodes
    .filter(node => node.kind === ts.SyntaxKind.TemplateExpression)
    .map(node => convertNode(node))
    .reduce((acc, cur) => acc.concat(cur), []);
}
