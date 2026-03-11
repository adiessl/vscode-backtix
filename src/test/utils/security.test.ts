import * as assert from 'assert';
import { escapeQuoteChars } from '../../core/utils/string.utils';

suite('security.test', function () {
  suite('escapeQuoteChars security fix', function () {
    test('should treat "." as a literal character, not a regex wildcard', function () {
      const result = escapeQuoteChars('abc', '"', '.');
      // If it matched everything, it would be '\a\b\c'
      // Since it should only match literal dots, it should be 'abc' (no dots in 'abc')
      assert.strictEqual(result, 'abc');
    });

    test('should treat "|" as a literal character, not a regex OR operator', function () {
      const result = escapeQuoteChars('abc', '"', 'a|b');
      // If it matched 'a' or 'b', it would be '\abc' or '\a\bc' etc.
      // Since it should only match literal 'a|b', it should be 'abc'
      assert.strictEqual(result, 'abc');
    });

    test('should handle ReDoS patterns safely by escaping them', function () {
        const maliciousQuote = '(a+)+$';
        const longString = '\\' + 'a'.repeat(25) + 'X';
        const start = Date.now();
        escapeQuoteChars(longString, maliciousQuote, "'");
        const end = Date.now();
        // If it was not escaped, it would take > 100ms. If escaped, it should be near 0ms.
        assert.ok(end - start < 100, `Execution took too long: ${end - start}ms`);
    });

    test('should correctly escape and unescape with special characters', function () {
        const original = 'a.b|c';
        // targetQuoteChar is '.'
        const escaped = escapeQuoteChars(original, '"', '.');
        assert.strictEqual(escaped, 'a\\.b|c');

        // currentQuoteChar is '.'
        const unescaped = escapeQuoteChars('a\\.b|c', '.', '"');
        assert.strictEqual(unescaped, 'a.b|c');
    });
  });
});
