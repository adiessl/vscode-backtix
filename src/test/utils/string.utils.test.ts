import * as assert from 'assert';
import { replaceQuoteChars, escapeQuoteChars, inlineLineBreaks, wrapText } from '../../core/utils/string.utils';

suite('string.utils.test', function () {
  suite('replaceQuoteChars', function () {
    suite('target: single quotes', function () {
      suite('simple strings: the quotes should be replaced', function () {
        test('from single quotes', function () {
          const original = `'This is a test.'`;
          const expected = `'This is a test.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', function () {
          const original = `"This is a test."`;
          const expected = `'This is a test.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', function () {
          const original = '`This is a test.`';
          const expected = `'This is a test.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including single quotes: single quotes should be escaped', function () {
        test('from single quotes', function () {
          const original = `"This is a 'test'."`;
          const expected = `'This is a \\'test\\'.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', function () {
          const original = '`This is a \'test\'.`';
          const expected = `'This is a \\'test\\'.'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including escaped quotes: should not be escaped afterwards', function () {
        test('from double quotes, including escaped double quotes', function () {
          const original = `"This is a \\"test\\"."`;
          const expected = `'This is a "test".'`;

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });

        test('from backticks, including escaped backticks', function () {
          const original = '`This is a \\`test\\`.`';
          const expected = '\'This is a `test`.\'';

          const actual = replaceQuoteChars(original, '\'');

          assert.strictEqual(actual, expected);
        });
      });
    });

    suite('target: double quotes', function () {
      suite('simple strings: the quotes should be replaced', function () {
        test('from single quotes', function () {
          const original = `'This is a test.'`;
          const expected = `"This is a test."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', function () {
          const original = `"This is a test."`;
          const expected = `"This is a test."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', function () {
          const original = '`This is a test.`';
          const expected = `"This is a test."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including double quotes: double quotes should be escaped', function () {
        test('from single quotes', function () {
          const original = `'This is a "test".'`;
          const expected = `"This is a \\"test\\"."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', function () {
          const original = '`This is a "test".`';
          const expected = `"This is a \\"test\\"."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including escaped quotes: should not be escaped afterwards', function () {
        test('from single quotes, including escaped single quotes', function () {
          const original = `'This is a \\'test\\'.'`;
          const expected = `"This is a 'test'."`;

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });

        test('from backticks, including escaped backticks', function () {
          const original = '`This is a \\`test\\`.`';
          const expected = '"This is a `test`."';

          const actual = replaceQuoteChars(original, '"');

          assert.strictEqual(actual, expected);
        });
      });
    });

    suite('target: backticks', function () {
      suite('simple strings: the quotes should be replaced', function () {
        test('from single quotes', function () {
          const original = `'This is a test.'`;
          const expected = '`This is a test.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', function () {
          const original = `"This is a test."`;
          const expected = '`This is a test.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from backticks', function () {
          const original = '`This is a test.`';
          const expected = '`This is a test.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including backticks: backticks should be escaped', function () {
        test('from single quotes', function () {
          const original = '\'This is a `test`.\'';
          const expected = '`This is a \\`test\\`.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes', function () {
          const original = '"This is a `test`."';
          const expected = '`This is a \\`test\\`.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });
      });

      suite('strings including escaped quotes: should not be escaped afterwards', function () {
        test('from single quotes, including escaped single quotes', function () {
          const original = `'This is a \\'test\\'.'`;
          const expected = '`This is a \'test\'.`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });

        test('from double quotes, including escaped double quotes', function () {
          const original = `"This is a \\"test\\"."`;
          const expected = '`This is a "test".`';

          const actual = replaceQuoteChars(original, '`');

          assert.strictEqual(actual, expected);
        });
      });
    });
  });

  suite('escapeQuoteChars', function () {
    test('should escape correctly', function () {
      const original = `This is a "test".`;
      const expected = `This is a \\"test\\".`;

      const actual = escapeQuoteChars(original, '\'', '"');

      assert.strictEqual(actual, expected);
    });

    test('should unescape correctly', function () {
      const original = `This is a \\"test\\".`;
      const expected = `This is a "test".`;

      const actual = escapeQuoteChars(original, '"', '\'');

      assert.strictEqual(actual, expected);
    });

    test('should escape and unescape correctly', function () {
      const original = 'This `is` a "test"';
      const expected = 'This `is` a \\"test\\"';

      const actual = escapeQuoteChars(original, '`', '"');

      assert.strictEqual(actual, expected);
    });
  });

  suite('inlineLineBreaks', function () {
    test('all line break types should be inlined', function () {
      const original = 'This\ris\r\na\ntest.';
      const expected = 'This\\ris\\r\\na\\ntest.';

      const actual = inlineLineBreaks(original);

      assert.strictEqual(actual, expected);
    });

    test('multiline template literals should be inlined correctly', function () {
      const original = `This
      is
      a
      test.`;

      const expected = 'This\\n      is\\n      a\\n      test.';

      const actual = inlineLineBreaks(original);

      assert.strictEqual(actual, expected);
    });
  });

  suite('wrapText', function () {
    test('the text should be wrapped with the specified string', function () {
      const original = 'Inside';
      const expected = '@@@Inside@@@';

      const actual = wrapText(original, '@@@');

      assert.strictEqual(actual, expected);
    });
  });
});
