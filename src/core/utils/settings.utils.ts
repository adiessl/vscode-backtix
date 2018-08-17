import { TargetLanguageSettings, ConversionTexts, ConversionTargets } from '../models/extensionSettings';
import { StringType } from '../models/constants';

export function getTargetStringTypes(targets: ConversionTargets): StringType[] {
  const mapping: [StringType, boolean][] = [
    [StringType.TEMPLATE_LITERAL, targets.convertToBackticks],
    [StringType.SINGLE_QUOTE, targets.convertToSingleQuotes],
    [StringType.DOUBLE_QUOTE, targets.convertToDoubleQuotes]
  ];

  return mapping
    .filter(([_, include]) => include)
    .map(([type, _]) => type);
}

export function getLanguages(settings: TargetLanguageSettings): string[] {
  return Object
    .keys(settings)
    .map(key => [key, settings[key]] as [string, boolean])
    .filter(([_, value]) => value === true)
    .map(([key, _]) => key);
}

export function getTargetMessages(texts: ConversionTexts): { [t in StringType]: string } {
  return {
    [StringType.SINGLE_QUOTE]: texts.convertToSingleQuotes,
    [StringType.DOUBLE_QUOTE]: texts.convertToDoubleQuotes,
    [StringType.TEMPLATE_LITERAL]: texts.convertToBackticks,
  };
}
