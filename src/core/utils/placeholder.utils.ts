import * as ts from 'typescript';

export function getTemplateLiteralParts(nodes: ts.Node[]): ts.Node[] {

  function getTemplateExpressionParts(node: ts.TemplateExpression): ts.Node[] {
    const arr: (ts.TemplateHead | ts.TemplateMiddle | ts.TemplateTail)[] = [node.head];
    return arr.concat(node.templateSpans.map(s => s.literal));
  }

  const noSubstitutionTemplateLiterals = nodes
    .filter(ts.isNoSubstitutionTemplateLiteral);

  const templateExpressionParts = nodes
    .filter(ts.isTemplateExpression)
    .map(getTemplateExpressionParts)
    .reduce((acc, cur) => acc.concat(cur), []);

  return templateExpressionParts.concat(noSubstitutionTemplateLiterals);
}
