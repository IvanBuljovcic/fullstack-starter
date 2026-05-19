import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./loader";

const meta = {
	title: "Shared/Loader",
	component: Loader,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "A loading indicator with variable sizes",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		size: {
			control: "radio",
			options: ["small", "medium", "large"],
			description: "Size of the spinner",
		},
		className: {
			control: "text",
			description: "Custom css class name",
		},
	},
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		size: "medium",
	},
};
