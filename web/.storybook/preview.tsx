import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnnouncementProvider } from "../src/providers/AnnouncementProvider";
import "../src/styles/globals.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000,
			gcTime: 10 * 60 * 1000,
		},
	},
});

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: "light",
			values: [
				{
					name: "light",
					value: "hsl(0, 0%, 100%)",
				},
				{
					name: "light-subtle",
					value: "hsl(240, 25%, 97%)",
				},
				{
					name: "dark",
					value: "hsl(0, 0%, 10%)",
				},
				{
					name: "dark-subtle",
					value: "hsl(0, 0%, 15%)",
				},
			],
		},
		viewport: {
			viewports: {
				mobile: {
					name: "Mobile",
					styles: {
						width: "375px",
						height: "667px",
					},
				},
				tablet: {
					name: "Tablet",
					styles: {
						width: "768px",
						height: "1024px",
					},
				},
				desktop: {
					name: "Desktop",
					styles: {
						width: "1440px",
						height: "900px",
					},
				},
			},
		},
	},
	decorators: [
		(Story) => (
			<QueryClientProvider client={queryClient}>
				<AnnouncementProvider>
					<Story />
				</AnnouncementProvider>
			</QueryClientProvider>
		),
	],
};

export default preview;
