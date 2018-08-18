export function replaceQuoteChars(text: string, targetQuoteChar: string) {
  const currentQuoteChar = text[0];

  if (currentQuoteChar === targetQuoteChar) {
    return text;
  }

  const innerText = text.substring(currentQuoteChar.length, text.length - currentQuoteChar.length);

  const replacedAndEscaped = escapeQuoteChars(innerText, currentQuoteChar, targetQuoteChar);

  return `${targetQuoteChar}${replacedAndEscaped}${targetQuoteChar}`;
}

export function escapeQuoteChars(text: string, currentQuoteChar: string, targetQuoteChar: string) {
  return text
    .replace(new RegExp(`\\\\${currentQuoteChar}`, 'g'), currentQuoteChar)
    .replace(new RegExp(`${targetQuoteChar}`, 'g'), `\\${targetQuoteChar}`);
}

export function replaceLineBreaks(text: string, replaceValue: string = ' ') {
  return text.replace(/(?:\r\n|\r|\n)/g, replaceValue);
}

export function wrapText(text: string, wrapper: string): string {
  return `${wrapper}${text}${wrapper}`;
}
