import * as ts from 'typescript';

import { StringType } from '../models/constants';
import { NodeReplacement } from '../models/nodeReplacement';
import { replaceQuoteChars, inlineLineBreaks } from '../utils/string.utils';

import { simpleLiteralConverterFactory } from './simpleLiteralConverterFactory';

export const convertStringLiterals = (nodes: ts.Node[], targets: StringType[]): NodeReplacement[] =>
  simpleLiteralConverterFactory(ts.SyntaxKind.StringLiteral, (text) => text, replaceQuoteChars)(nodes, targets);

export const convertNoSubstitutionTemplateLiterals = (nodes: ts.Node[], targets: StringType[]): NodeReplacement[] =>
  simpleLiteralConverterFactory(ts.SyntaxKind.NoSubstitutionTemplateLiteral, inlineLineBreaks, replaceQuoteChars)(nodes, targets);
