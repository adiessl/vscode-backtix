export enum StringType {
  TEMPLATE_LITERAL,
  SINGLE_QUOTE,
  DOUBLE_QUOTE
}

export const StringKindToQuote: { [type in StringType]: string } = {
  [StringType.TEMPLATE_LITERAL]: '`',
  [StringType.SINGLE_QUOTE]: '\'',
  [StringType.DOUBLE_QUOTE]: '"'
};
