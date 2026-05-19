#!/usr/bin/env tsx

/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { Command } from "commander";

interface GeneratorOptions {
	client?: boolean;
	styles?: boolean;
	props?: string;
	directory?: string;
	force?: boolean;
}

const program = new Command();

// Template loader utility
function loadTemplate(templateName: string): string {
	const templatePath = path.join(__dirname, "templates", `${templateName}.template`);
	try {
		return fs.readFileSync(templatePath, "utf8");
	} catch {
		console.error(chalk.red(`Error loading template: ${templateName}`));
		console.error(chalk.red(`Template path: ${templatePath}`));
		process.exit(1);
	}
}

// Utility to ensure directory exists
function ensureDir(dirPath: string): void {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

// Utility to format component name (PascalCase)
function formatComponentName(name: string): string {
	return name
		.split(/[-_\s]+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join("");
}

// Utility to format file name (kebab-case)
function formatFileName(name: string): string {
	return (
		name
			// Insert hyphen before uppercase letters (except the first character)
			.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
			// Handle consecutive capitals (e.g., "XMLParser" -> "xml-parser")
			.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
			.toLowerCase()
			// Clean up any duplicate hyphens
			.replace(/-+/g, "-")
			// Remove leading/trailing hyphens
			.replace(/^-|-$/g, "")
	);
}

// Parse props from the new format "name: string; age: number"
function parseProps(propsString: string): Array<{ name: string; type: string }> {
	if (!propsString) return [];

	return propsString
		.split(";")
		.map((prop) => prop.trim())
		.filter((prop) => prop.length > 0)
		.map((prop) => {
			const [name, type] = prop.split(":").map((part) => part.trim());
			return { name, type: type || "string" };
		});
}

// Generate component function
function generateComponent(name: string, options: GeneratorOptions): void {
	const componentName = formatComponentName(name);
	const fileName = formatFileName(name);
	const directoryName = name; // Use original name for directory (preserves case)

	// Determine component type (server by default, client if flag is passed)
	const isClient = options.client;

	// Determine target directory - always relative to /src
	const targetDir = options.directory
		? path.resolve(process.cwd(), "src", options.directory)
		: path.resolve(process.cwd(), "src", "components");

	const componentDir = path.join(targetDir, directoryName);

	// Ensure base target directory exists
	ensureDir(targetDir);

	// Check if component already exists
	if (fs.existsSync(componentDir)) {
		if (!options.force) {
			console.log(chalk.yellow(`⚠️  Component "${componentName}" already exists at:`));
			console.log(chalk.gray(`   ${componentDir}`));
			console.log(chalk.gray("\nExisting files:"));

			const existingFiles = fs.readdirSync(componentDir);
			existingFiles.forEach((file) => {
				const filePath = path.join(componentDir, file);
				const stats = fs.statSync(filePath);
				const size = `${(stats.size / 1024).toFixed(1)}KB`;
				console.log(chalk.gray(`   - ${file} (${size})`));
			});

			console.log(chalk.red("\n❌ Generation cancelled to prevent overwriting existing files."));
			console.log(chalk.gray("\nOptions:"));
			console.log(chalk.gray("  • Use --force to overwrite existing component"));
			console.log(chalk.gray("  • Choose a different name"));
			console.log(chalk.gray("  • Use --directory to create in a different location within /src"));
			process.exit(1);
		} else {
			console.log(chalk.yellow(`⚠️  Overwriting existing component "${componentName}" at:`));
			console.log(chalk.gray(`   ${componentDir}`));
		}
	}

	console.log(chalk.blue(`🚀 Generating ${isClient ? "client" : "server"} component: ${componentName}`));
	console.log(chalk.gray(`   Directory: ${componentDir}`));

	// Ensure component directory exists
	ensureDir(componentDir);

	// Load appropriate template
	const templateName = isClient ? "client-component" : "server-component";
	let template = loadTemplate(templateName);

	// Process props
	let propsTypeDefinition = "";
	let propsDestructuring = "";
	const propsType = `: ${componentName}Props`;

	if (options.props) {
		const props = parseProps(options.props);

		if (props.length > 0) {
			// Generate TypeScript type
			propsTypeDefinition = `type ${componentName}Props = {\n${props.map((prop) => `  ${prop.name}: ${prop.type};`).join("\n")}\n};`;

			// Generate props destructuring
			propsDestructuring = `{ ${props.map((prop) => prop.name).join(", ")} }`;
		} else {
			// Empty props
			propsTypeDefinition = `type ${componentName}Props = {};`;
			propsDestructuring = "props";
		}
	} else {
		// Generate empty props type
		propsTypeDefinition = `type ${componentName}Props = {};`;
		propsDestructuring = "props";
	}

	// Replace template placeholders (but handle className separately)
	template = template
		.replace(/{{COMPONENT_NAME}}/g, componentName)
		.replace(/{{PROPS_TYPE_DEFINITION}}/g, propsTypeDefinition)
		.replace(/{{PROPS_DESTRUCTURING}}/g, propsDestructuring)
		.replace(/{{PROPS_TYPE}}/g, propsType);

	// Handle styles and className conditionally
	if (options.styles) {
		// Add CSS module import when styles flag is set
		const importLine = `import styles from './${fileName}.module.css';`;

		if (isClient) {
			// For client components, add import after React import
			template = template.replace(/(import React, { useState } from 'react';)/, `$1\n${importLine}`);
		} else {
			// For server components, add import at the top
			template = `${importLine}\n\n${template}`;
		}

		// Replace the className placeholder with CSS modules
		template = template.replace(/className="{{FILE_NAME}}"/g, `className={styles.container}`);
	} else {
		// Replace the className placeholder with regular string className
		template = template.replace(/className="{{FILE_NAME}}"/g, `className="container"`);
	}

	// Write component file
	const componentPath = path.join(componentDir, `${fileName}.tsx`);
	fs.writeFileSync(componentPath, template);
	console.log(chalk.green(`✅ Created component: ${componentPath}`));

	// Generate styles file only if requested
	if (options.styles) {
		const stylesTemplate = loadTemplate("styles.module");
		const stylesContent = stylesTemplate.replace(/{{COMPONENT_NAME}}/g, fileName);
		const stylesPath = path.join(componentDir, `${fileName}.module.css`);
		fs.writeFileSync(stylesPath, stylesContent);
		console.log(chalk.green(`✅ Created styles: ${stylesPath}`));
	}

	// Generate index.ts for cleaner imports
	const indexContent = `export { default } from './${fileName}';\nexport type { ${componentName}Props } from './${fileName}';\n`;
	const indexPath = path.join(componentDir, "index.ts");
	fs.writeFileSync(indexPath, indexContent);
	console.log(chalk.green(`✅ Created index: ${indexPath}`));

	console.log(chalk.blue("\n🎉 Component generated successfully!"));
	console.log(chalk.gray(`\nFiles created:`));
	console.log(chalk.green(`  ✓ ${path.relative(process.cwd(), componentPath)}`));
	if (options.styles) {
		console.log(chalk.green(`  ✓ ${path.relative(process.cwd(), path.join(componentDir, `${fileName}.module.css`))}`));
	}
	console.log(chalk.green(`  ✓ ${path.relative(process.cwd(), indexPath)}`));

	console.log(chalk.gray(`\nComponent location:`));
	console.log(chalk.yellow(`  ${path.relative(process.cwd(), componentDir)}/`));
	console.log(chalk.gray(`\nUsage example:`));
	console.log(chalk.yellow(`import ${componentName} from '${path.relative(process.cwd(), componentDir)}';`));

	if (options.props && parseProps(options.props).length > 0) {
		console.log(chalk.gray(`\nComponent props:`));
		parseProps(options.props).forEach((prop) => {
			console.log(chalk.yellow(`  ${prop.name}: ${prop.type}`));
		});
	}
}

// CLI setup
program
	.name("generate-component")
	.description(`Generate Next.js components with templates ${chalk.yellowBright("(server components by default)")}`)
	.version("1.0.0");

program
	.argument("<n>", "Component name")
	.option("-c, --client", `Generate client component (default: ${chalk.blueBright("server component")})`)
	.option("-s, --styles", "Generate CSS module file")
	.option("-p, --props <props>", `Component props (format: ${chalk.blueBright("name: string; age: number")})`)
	.option(
		"-d, --directory <path>",
		`Target directory relative to ${chalk.yellowBright("/src")} (default: ${chalk.blueBright("components")})`
	)
	.option("-f, --force", `Force ${chalk.redBright("overwrite")} existing component`)
	.action((name: string, options: GeneratorOptions) => {
		generateComponent(name, options);
	});

program.parse();
