'use strict';
import * as vscode from 'vscode';

import { BacktixCodeActionProvider } from './core/backtixCodeActionProvider';

import { ExtensionSettings } from './core/models/extensionSettings';
import { getLanguages } from './core/utils/settings.utils';

let backtixCodeActionProvider: BacktixCodeActionProvider;

export function activate(context: vscode.ExtensionContext) {
  const extensionSettings = getExtensionSettings();
  const languages = getLanguages(extensionSettings.languages);

  backtixCodeActionProvider = new BacktixCodeActionProvider(extensionSettings);
  backtixCodeActionProvider.activate(context.subscriptions);

  vscode.languages.registerCodeActionsProvider(languages, backtixCodeActionProvider);
}

export function deactivate() {
  backtixCodeActionProvider.dispose();
}

function getExtensionSettings(): ExtensionSettings {
  const extensionSettings = vscode.workspace.getConfiguration().get<ExtensionSettings>('backtix');

  if (extensionSettings === undefined) {
    throw new Error('BacktiX extension settings are undefined!');
  }

  return extensionSettings;
}
