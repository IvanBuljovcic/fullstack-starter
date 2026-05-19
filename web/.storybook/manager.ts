import { addons } from "@storybook/manager-api";
import { darkTheme, lightTheme } from "./theme";

const isDarkMode = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

addons.setConfig({
	theme: isDarkMode ? darkTheme : lightTheme,
	sidebar: {
		showRoots: true,
		collapsedRoots: ["other"],
	},
	toolbar: {
		title: { hidden: false },
		zoom: { hidden: false },
		eject: { hidden: false },
		copy: { hidden: false },
		fullscreen: { hidden: false },
	},
});

if (window.matchMedia) {
	const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
	darkModeQuery.addEventListener("change", (e) => {
		addons.setConfig({
			theme: e.matches ? darkTheme : lightTheme,
		});
	});
}
