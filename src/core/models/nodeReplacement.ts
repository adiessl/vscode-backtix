import * as ts from 'typescript';
import { StringType } from './constants';

export interface NodeReplacement {
  node: ts.Node;
  targetType: StringType;
  replacement: string;
}

export function createNodeReplacement(node: ts.Node, targetType: StringType, replacement: string): NodeReplacement {
  return {
    node,
    targetType,
    replacement
  };
}
