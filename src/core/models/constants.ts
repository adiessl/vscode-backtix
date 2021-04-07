export enum StringType {
  TEMPLATE_LITERAL,
  SINGLE_QUOTE,
  DOUBLE_QUOTE
}

export const stringTypeToQuote: { [type in StringType]: string } = {
  [StringType.TEMPLATE_LITERAL]: '`',
  [StringType.SINGLE_QUOTE]: '\'',
  [StringType.DOUBLE_QUOTE]: '"'
};

export enum DiagnosticCodes {
  ADD_PLACEHOLDER
}
