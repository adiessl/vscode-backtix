import * as ts from 'typescript';

import { StringType, stringTypeToQuote } from '../models/constants';
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
      const replacements: NodeReplacement[] = [];

      for (const target of targets) {
        const replaced = replaceQuoteCharsFunc(text, stringTypeToQuote[target]);
        if (replaced !== text) {
          replacements.push(createNodeReplacement(node, target, replaced));
        }
      }

      return replacements;
    }

    return nodes
      .filter(node => node.kind === filterSyntaxKind)
      .flatMap(node => convertNode(node));
  };
}
