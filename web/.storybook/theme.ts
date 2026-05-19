import { create } from "@storybook/theming";

export const lightTheme = create({
	base: "light",
	brandTitle: "Next.js Template",
	brandUrl: "/",
	brandTarget: "_self",

	colorPrimary: "hsl(356, 80%, 52%)",
	colorSecondary: "hsl(240, 50%, 26%)",

	appBg: "hsl(240, 25%, 97%)",
	appContentBg: "hsl(0, 0%, 100%)",
	appPreviewBg: "hsl(0, 0%, 100%)",
	appBorderColor: "hsl(0, 0%, 85%)",
	appBorderRadius: 8,

	fontBase:
		'"Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
	fontCode: "ui-monospace, Menlo, Monaco, monospace",

	textColor: "hsl(0, 0%, 10%)",
	textInverseColor: "hsl(0, 0%, 100%)",
	textMutedColor: "hsl(0, 0%, 43%)",

	barTextColor: "hsl(0, 0%, 29%)",
	barSelectedColor: "hsl(356, 80%, 52%)",
	barHoverColor: "hsl(356, 73%, 45%)",
	barBg: "hsl(0, 0%, 100%)",

	inputBg: "hsl(0, 0%, 97%)",
	inputBorder: "hsl(0, 0%, 85%)",
	inputTextColor: "hsl(0, 0%, 10%)",
	inputBorderRadius: 8,

	buttonBg: "hsl(240, 25%, 97%)",
	buttonBorder: "hsl(0, 0%, 85%)",
	booleanBg: "hsl(0, 0%, 91%)",
	booleanSelectedBg: "hsl(356, 80%, 52%)",
});

export const darkTheme = create({
	base: "dark",
	brandTitle: "Next.js Template",
	brandUrl: "/",
	brandTarget: "_self",

	colorPrimary: "hsl(356, 80%, 52%)",
	colorSecondary: "hsl(240, 50%, 50%)",

	appBg: "hsl(0, 0%, 15%)",
	appContentBg: "hsl(0, 0%, 10%)",
	appPreviewBg: "hsl(0, 0%, 10%)",
	appBorderColor: "hsl(0, 0%, 25%)",
	appBorderRadius: 8,

	fontBase:
		'"Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
	fontCode: "ui-monospace, Menlo, Monaco, monospace",

	textColor: "hsl(0, 0%, 95%)",
	textInverseColor: "hsl(0, 0%, 10%)",
	textMutedColor: "hsl(0, 0%, 60%)",

	barTextColor: "hsl(0, 0%, 75%)",
	barSelectedColor: "hsl(356, 80%, 52%)",
	barHoverColor: "hsl(356, 73%, 60%)",
	barBg: "hsl(0, 0%, 10%)",

	inputBg: "hsl(0, 0%, 15%)",
	inputBorder: "hsl(0, 0%, 30%)",
	inputTextColor: "hsl(0, 0%, 95%)",
	inputBorderRadius: 8,

	buttonBg: "hsl(0, 0%, 15%)",
	buttonBorder: "hsl(0, 0%, 30%)",
	booleanBg: "hsl(0, 0%, 25%)",
	booleanSelectedBg: "hsl(356, 80%, 52%)",
});
