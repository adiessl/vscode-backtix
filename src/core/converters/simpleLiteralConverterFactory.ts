import * as ts from 'typescript';

import { StringType, StringKindToQuote } from '../models/constants';
import { NodeReplacement, createNodeReplacement } from '../models/nodeReplacement';

export function simpleLiteralConverterFactory(
  filterSyntaxKind: ts.SyntaxKind,
  preprocessTextFunc: (text: string) => string,
  replaceQuoteCharsFunc: (text: string, targetQuoteChar: string) => string
): (nodes: ts.Node[], targets: StringType[]) => NodeReplacement[] {

  return function (
    nodes: ts.Node[],
    targets: StringType[]
  ): NodeReplacement[] {

    function convertNode(
      node: ts.Node
    ): NodeReplacement[] {
      const text = preprocessTextFunc(node.getText());

      return targets
        .map(target => [target, replaceQuoteCharsFunc(text, StringKindToQuote[target])] as [StringType, string])
        .filter(([_, replaced]) => replaced !== text)
        .map(([target, replaced]) => createNodeReplacement(node, target, replaced));
    }

    return nodes
      .filter(node => node.kind === filterSyntaxKind)
      .map(node => convertNode(node))
      .reduce((acc, cur) => acc.concat(cur), []);
  };
}
