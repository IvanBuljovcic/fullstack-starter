const shell = require("shelljs");

// Helper to get current branch
function getCurrentBranch() {
	return shell.exec("git rev-parse --abbrev-ref HEAD", { silent: true }).stdout.trim();
}

/** @type {import('commitlint').Config} */
module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		// Required: Keep conventional commit types for changelog/semantic release
		"type-enum": [
			2,
			"always",
			["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"],
		],

		// Optional: Scope validation (warning only - encouraged but not required)
		"scope-enum": async () => {
			const branch = getCurrentBranch();
			const branchScope = branch.includes("/") ? branch.split("/")[1].toUpperCase() : branch.toUpperCase();

			// Warn if scope doesn't match known patterns
			return [
				1, // Warning only (not blocking)
				"always",
				[
					branchScope,
					"API",
					"WEB",
					"SHARED",
					"TYPES",
					"CONFIG",
					"CI",
					"BUILD",
					"DEPS",
					"TESTS",
					"E2E",
					"AUTH",
					"DB",
					"UI",
					"I18N",
					"ANALYTICS",
				],
			];
		},

		// Scope is optional everywhere - warning only to encourage good practice
		"scope-empty": [1, "never"], // Warning: encourages scope but doesn't block

		// Flexible case - allow lowercase or uppercase scopes
		"scope-case": [1, "always", "upper-case"], // Warning only

		// Relaxed length limits for solo dev
		"header-max-length": [1, "always", 100], // Warning at 100 chars
		"body-max-line-length": [0], // No limit on body

		// Allow any subject case for flexibility
		"subject-case": [0],

		// Require subject to not be empty
		"subject-empty": [2, "never"],
	},
};
