import { defineConfig } from '@vscode/test-cli';

const stableConfig = defineConfig({
	files: 'out/test/**/*.test.js',
	version: 'stable',
	label: 'stable'
});

const insidersConfig = defineConfig({
	files: 'out/test/**/*.test.js',
	version: 'insiders',
	label: 'insiders'
});

export default [stableConfig, insidersConfig];
