import { defineConfig } from '@vscode/test-cli';

const stableConfig = defineConfig({
	files: 'out/test/**/*.test.js',
	version: 'stable',
	label: 'stable',
	mocha: {
		timeout: 10000
	}
});

const insidersConfig = defineConfig({
	files: 'out/test/**/*.test.js',
	version: 'insiders',
	label: 'insiders',
	mocha: {
		timeout: 10000
	}
});

export default [stableConfig, insidersConfig];
