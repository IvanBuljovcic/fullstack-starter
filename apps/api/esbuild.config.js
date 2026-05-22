const esbuildPluginTsc = require("esbuild-plugin-tsc");
const { join } = require("node:path");

module.exports = {
	sourcemap: true,
	plugins: [
		esbuildPluginTsc({
			tsconfigPath: join(__dirname, "tsconfig.app.json"),
		}),
	],
};
