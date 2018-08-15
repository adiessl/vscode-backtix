export enum StringType {
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  TEMPLATE_LITERAL
}

export const StringKindToQuote: { [type in StringType]: string } = {
  [StringType.SINGLE_QUOTE]: '\'',
  [StringType.DOUBLE_QUOTE]: '"',
  [StringType.TEMPLATE_LITERAL]: '`'
};
