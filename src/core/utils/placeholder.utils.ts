import * as ts from 'typescript';

export function getTemplateLiteralParts(nodes: ts.Node[]): ts.Node[] {

  const result: ts.Node[] = [];
  const noSubstitutionTemplateLiterals: ts.NoSubstitutionTemplateLiteral[] = [];

  for (const node of nodes) {
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      noSubstitutionTemplateLiterals.push(node);
    } else if (ts.isTemplateExpression(node)) {
      result.push(node.head);
      for (const span of node.templateSpans) {
        result.push(span.literal);
      }
    }
  }

  return result.concat(noSubstitutionTemplateLiterals);
}
