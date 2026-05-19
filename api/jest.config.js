/* eslint-disable */
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

// Reading the SWC compilation config for the spec files
const swcJestConfig = JSON.parse(readFileSync(join(__dirname, ".spec.swcrc"), "utf-8"));

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

module.exports = {
	displayName: "@org/api",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": ["@swc/jest", swcJestConfig],
	},
	moduleFileExtensions: ["ts", "js", "html"],
	coverageDirectory: "../test-output/jest/api/coverage",
	testMatch: ["<rootDir>/src/**/*.spec.ts", "<rootDir>/src/**/*.integration.spec.ts"],
	modulePathIgnorePatterns: ["<rootDir>/dist"],
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/dist/",
		"/src/generated/", // Exclude Prisma generated client
		"\\.spec\\.ts$", // Exclude test files
		"\\.integration\\.spec\\.ts$", // Exclude integration test files
	],
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/generated/**", // Exclude Prisma generated client
		"!src/**/*.spec.ts", // Exclude test files
		"!src/**/*.integration.spec.ts", // Exclude integration test files
		"!src/main.ts", // Exclude bootstrap file (hard to test)
		"!src/prisma/**", // Exclude Prisma service/module (thin wrappers, tested via integration)
		"!src/**/*.dto.ts", // Exclude DTOs (just decorators, validated via controllers)
		"!src/**/*.module.ts", // Exclude NestJS modules (just configuration)
		"!src/**/*.controller.ts", // Exclude NestJS modules (just configuration)
	],
};
