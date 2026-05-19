const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { join } = require("node:path");

module.exports = {
	output: {
		path: join(__dirname, "dist"),
		clean: true,
		...(process.env.NODE_ENV !== "production" && {
			devtoolModuleFilenameTemplate: "[absolute-resource-path]",
		}),
	},
	ignoreWarnings: [
		{
			module: /pg-native/,
			message: /Can't resolve 'pg-native'/,
		},
	],
	plugins: [
		new NxAppWebpackPlugin({
			target: "node",
			compiler: "tsc",
			main: "./src/main.ts",
			tsConfig: "./tsconfig.app.json",
			assets: ["./src/assets"],
			optimization: false,
			outputHashing: "none",
			generatePackageJson: false,
			sourceMap: true,
			externalDependencies: "all",
		}),
	],
};
