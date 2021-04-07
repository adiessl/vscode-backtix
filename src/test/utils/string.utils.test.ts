import * as assert from 'assert';
import { replaceQuoteChars, escapeQuoteChars, inlineLineBreaks, wrapText } from '../../core/utils/string.utils';

suite('string.utils.test', () => {
  suite('replaceQuoteChars', () => {
    suite('target: single quotes', () => {
      suite('simple strings: the quotes should be replaced', () => {
        test('from single quotes', () => {
          const original = `'This is a test.'`;
          const expected = `'This is a test.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', () => {
          const original = `"This is a test."`;
          const expected = `'This is a test.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', () => {
          const original = '`This is a test.`';
          const expected = `'This is a test.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including single quotes: single quotes should be escaped', () => {
        test('from single quotes', () => {
          const original = `"This is a 'test'."`;
          const expected = `'This is a \\'test\\'.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', () => {
          const original = '`This is a \'test\'.`';
          const expected = `'This is a \\'test\\'.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including escaped quotes: should not be escaped afterwards', () => {
        test('from double quotes, including escaped double quotes', () => {
          const original = `"This is a \\"test\\"."`;
          const expected = `'This is a "test".'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from backticks, including escaped backticks', () => {
          const original = '`This is a \\`test\\`.`';
          const expected = '\'This is a `test`.\'';

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });
      });
    });

    suite('target: double quotes', () => {
      suite('simple strings: the quotes should be replaced', () => {
        test('from single quotes', () => {
          const original = `'This is a test.'`;
          const expected = `"This is a test."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', () => {
          const original = `"This is a test."`;
          const expected = `"This is a test."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', () => {
          const original = '`This is a test.`';
          const expected = `"This is a test."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including double quotes: double quotes should be escaped', () => {
        test('from single quotes', () => {
          const original = `'This is a "test".'`;
          const expected = `"This is a \\"test\\"."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', () => {
          const original = '`This is a "test".`';
          const expected = `"This is a \\"test\\"."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including escaped quotes: should not be escaped afterwards', () => {
        test('from single quotes, including escaped single quotes', () => {
          const original = `'This is a \\'test\\'.'`;
          const expected = `"This is a 'test'."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from backticks, including escaped backticks', () => {
          const original = '`This is a \\`test\\`.`';
          const expected = '"This is a `test`."';

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });
      });
    });

    suite('target: backticks', () => {
      suite('simple strings: the quotes should be replaced', () => {
        test('from single quotes', () => {
          const original = `'This is a test.'`;
          const expected = '`This is a test.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', () => {
          const original = `"This is a test."`;
          const expected = '`This is a test.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', () => {
          const original = '`This is a test.`';
          const expected = '`This is a test.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including backticks: backticks should be escaped', () => {
        test('from single quotes', () => {
          const original = '\'This is a `test`.\'';
          const expected = '`This is a \\`test\\`.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', () => {
          const original = '"This is a `test`."';
          const expected = '`This is a \\`test\\`.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including escaped quotes: should not be escaped afterwards', () => {
        test('from single quotes, including escaped single quotes', () => {
          const original = `'This is a \\'test\\'.'`;
          const expected = '`This is a \'test\'.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes, including escaped double quotes', () => {
          const original = `"This is a \\"test\\"."`;
          const expected = '`This is a "test".`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });
      });
    });
  });

  suite('escapeQuoteChars', () => {
    test('should escape correctly', () => {
      const original = `This is a "test".`;
      const expected = `This is a \\"test\\".`;

      const actual = escapeQuoteChars(original, '\'', '"');

      assert.strictEqual(actual, expected);
    });

    test('should unescape correctly', () => {
      const original = `This is a \\"test\\".`;
      const expected = `This is a "test".`;

      const actual = escapeQuoteChars(original, '"', '\'');

      assert.strictEqual(actual, expected);
    });

    test('should escape and unescape correctly', () => {
      const original = 'This `is` a "test"';
      const expected = 'This `is` a \\"test\\"';

      const actual = escapeQuoteChars(original, '`', '"');

      assert.strictEqual(actual, expected);
    });
  });

  suite('inlineLineBreaks', () => {
    test('all line break types should be inlined', () => {
      const original = 'This\ris\r\na\ntest.';
      const expected = 'This\\ris\\r\\na\\ntest.';

      const actual = inlineLineBreaks(original);

      assert.strictEqual(actual, expected);
    });

    test('multiline template literals should be inlined correctly', () => {
      const original = `This
      is
      a
      test.`;

      const expected = 'This\\n      is\\n      a\\n      test.';

      const actual = inlineLineBreaks(original);

      assert.strictEqual(actual, expected);
    });
  });

  suite('wrapText', () => {
    test('the text should be wrapped with the specified string', () => {
      const original = 'Inside';
      const expected = '@@@Inside@@@';

      const actual = wrapText(original, '@@@');

      assert.strictEqual(actual, expected);
    });
  });
});
