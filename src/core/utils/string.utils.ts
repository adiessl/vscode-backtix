export function replaceQuoteChars(text: string, targetQuoteChar: string): string {
  const currentQuoteChar = text[0];

  if (currentQuoteChar === targetQuoteChar) {
    return text;
  }

  const innerText = text.substring(currentQuoteChar.length, text.length - currentQuoteChar.length);

  const replacedAndEscaped = escapeQuoteChars(innerText, currentQuoteChar, targetQuoteChar);

  return `${targetQuoteChar}${replacedAndEscaped}${targetQuoteChar}`;
}

export function escapeQuoteChars(text: string, currentQuoteChar: string, targetQuoteChar: string): string {
  return text
    .replace(new RegExp(`\\\\${currentQuoteChar}`, 'g'), currentQuoteChar)
    .replace(new RegExp(`${targetQuoteChar}`, 'g'), `\\${targetQuoteChar}`);
}

export function inlineLineBreaks(text: string): string {
  return text.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

export function wrapText(text: string, wrapper: string): string {
  return `${wrapper}${text}${wrapper}`;
}
