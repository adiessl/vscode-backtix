export interface ExtensionSettings {
  languages: TargetLanguageSettings;

  conversions: ConversionTargets;

  conversionTexts: ConversionTexts;

  placeholders: PlaceholderSettings;
}

export interface TargetLanguageSettings {
  javascript: boolean;
  typescript: boolean;
  javascriptreact: boolean;
  typescriptreact: boolean;

  [key: string]: boolean | undefined;
}

export interface ConversionTargets {
  convertToSingleQuotes: boolean;
  convertToDoubleQuotes: boolean;
  convertToBackticks: boolean;
}

export interface ConversionTexts {
  convertToSingleQuotes: string;
  convertToDoubleQuotes: string;
  convertToBackticks: string;
}

export interface PlaceholderSettings {
  active: boolean;
  text: string;
}
