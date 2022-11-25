import * as assert from 'assert';
import { ConversionTargets, TargetLanguageSettings, ConversionTexts } from '../../core/models/extensionSettings';
import { StringType } from '../../core/models/constants';
import { getTargetStringTypes, getLanguages, getTargetMessages } from '../../core/utils/settings.utils';

suite('setting.utils.test', function() {
  suite('getTargetStringTypes', function() {

    function getConversionTargets(
      convertToBackticks: boolean,
      convertToSingleQuotes: boolean,
      convertToDoubleQuotes: boolean
    ): ConversionTargets {
      return {
        convertToBackticks,
        convertToSingleQuotes,
        convertToDoubleQuotes
      };
    }

    test('should be empty if all targets are set to false', function() {
      const targets = getConversionTargets(false, false, false);
      const expected: StringType[] = [];

      const actual = getTargetStringTypes(targets);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "StringType.TEMPLATE_LITERAL" if "convertToBackticks" is set to true', function() {
      const targets = getConversionTargets(true, false, false);
      const expected: StringType[] = [StringType.TEMPLATE_LITERAL];

      const actual = getTargetStringTypes(targets);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "StringType.SINGLE_QUOTE" if "convertToSingleQuotes" is set to true', function() {
      const targets = getConversionTargets(false, true, false);
      const expected: StringType[] = [StringType.SINGLE_QUOTE];

      const actual = getTargetStringTypes(targets);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "StringType.DOUBLE_QUOTE" if "convertToDoubleQuotes" is set to true', function() {
      const targets = getConversionTargets(false, false, true);
      const expected: StringType[] = [StringType.DOUBLE_QUOTE];

      const actual = getTargetStringTypes(targets);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain all possibilities if all are set to true', function() {
      const targets = getConversionTargets(true, true, true);
      const expected: StringType[] = [
        StringType.TEMPLATE_LITERAL,
        StringType.SINGLE_QUOTE,
        StringType.DOUBLE_QUOTE
      ];

      const actual = getTargetStringTypes(targets);

      assert.deepStrictEqual(actual, expected);
    });
  });

  suite('getLanguages', function() {

    function getTargetLanguageSettings(
      javascript: boolean,
      javascriptreact: boolean,
      typescript: boolean,
      typescriptreact: boolean
    ): TargetLanguageSettings {
      return {
        javascript,
        javascriptreact,
        typescript,
        typescriptreact
      };
    }

    test('should be empty if all targets are set to false', function() {
      const targetLanguages = getTargetLanguageSettings(false, false, false, false);
      const expected: string[] = [];

      const actual = getLanguages(targetLanguages);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "javascript" if set to true', function() {
      const targetLanguages = getTargetLanguageSettings(true, false, false, false);
      const expected: string[] = ['javascript'];

      const actual = getLanguages(targetLanguages);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "javascriptreact" if set to true', function() {
      const targetLanguages = getTargetLanguageSettings(false, true, false, false);
      const expected: string[] = ['javascriptreact'];

      const actual = getLanguages(targetLanguages);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "typescript" if set to true', function() {
      const targetLanguages = getTargetLanguageSettings(false, false, true, false);
      const expected: string[] = ['typescript'];

      const actual = getLanguages(targetLanguages);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain "typescriptreact" if set to true', function() {
      const targetLanguages = getTargetLanguageSettings(false, false, false, true);
      const expected: string[] = ['typescriptreact'];

      const actual = getLanguages(targetLanguages);

      assert.deepStrictEqual(actual, expected);
    });

    test('should contain all possibilities if all are set to true', function() {
      const targetLanguages = getTargetLanguageSettings(true, true, true, true);
      const expected: string[] = [
        'javascript',
        'javascriptreact',
        'typescript',
        'typescriptreact'
      ];

      const actual = getLanguages(targetLanguages);

      assert.deepStrictEqual(actual, expected);
    });
  });

  suite('getTargetMessages', function() {
    test('should map the conversion texts correctly', function() {
      const conversionTexts: ConversionTexts = {
        convertToBackticks: 'backticks',
        convertToSingleQuotes: 'single',
        convertToDoubleQuotes: 'double'
      };
      const expected: { [t in StringType]: string } = {
        [StringType.TEMPLATE_LITERAL]: 'backticks',
        [StringType.SINGLE_QUOTE]:'single',
        [StringType.DOUBLE_QUOTE]:'double'
      };

      const actual = getTargetMessages(conversionTexts);

      assert.deepStrictEqual(actual, expected);
    });
  });
});
