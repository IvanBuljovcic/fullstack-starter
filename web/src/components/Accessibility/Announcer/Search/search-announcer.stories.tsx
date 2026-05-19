import type { Meta, StoryObj } from "@storybook/react";
import { SearchAnnouncer } from "./search-announcer";

const meta = {
	title: "Accessibility/Announcer/Search",
	component: SearchAnnouncer,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Annouce search states to screen readers. The announcements are not visible but are read by assistive technologies. Check your browser console or screen reader to hear the announcements.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		query: {
			control: "text",
			description: "Search query",
		},
		resultCount: {
			control: "number",
			description: "Number of results returned for query",
		},
		status: {
			control: "radio",
			options: ["loading", "success", "error"],
			description: "Current search status",
		},
		totalTime: {
			control: "number",
			description: "Elapsed time for search query. In seconds.",
		},
	},
} satisfies Meta<typeof SearchAnnouncer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
	args: {
		query: "Foo",
		status: "loading",
	},
};

export const Success: Story = {
	args: {
		query: "Foo",
		status: "success",
		resultCount: 15,
		totalTime: 3,
	},
};

export const ErrorState: Story = {
	args: {
		query: "Foo",
		status: "error",
	},
};
