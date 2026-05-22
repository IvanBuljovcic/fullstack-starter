import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio } from "./radio";

const meta = {
	title: "Shared/Radio",
	component: Radio,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A flexible radio button component that extends native HTML radio button functionality with support for labels, errors, helper text, and multiple sizes. Built with CSS Modules and supports all native radio button props.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label text for the radio button",
		},
		error: {
			control: "text",
			description: "Error message to display",
		},
		helperText: {
			control: "text",
			description: "Helper text to display below the radio button",
		},
		size: {
			control: "radio",
			options: ["sm", "md", "lg"],
			description: "Size variant of the radio button",
		},
		disabled: {
			control: "boolean",
			description: "Whether the radio button is disabled",
		},
		required: {
			control: "boolean",
			description: "Whether the radio button is required",
		},
		checked: {
			control: "boolean",
			description: "Whether the radio button is checked",
		},
	},
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Accept terms and conditions",
	},
};

export const WithHelperText: Story = {
	args: {
		label: "Subscribe to newsletter",
		helperText: "We'll send you weekly updates about new features",
	},
};

export const WithError: Story = {
	args: {
		label: "Accept terms and conditions",
		error: "You must accept the terms to continue",
	},
};

export const Required: Story = {
	args: {
		label: "I agree to the privacy policy",
		required: true,
		helperText: "This field is required",
	},
};

export const Disabled: Story = {
	args: {
		label: "Disabled option",
		disabled: true,
	},
};

export const DisabledChecked: Story = {
	args: {
		label: "Disabled and checked",
		disabled: true,
		checked: true,
	},
};

export const SmallSize: Story = {
	args: {
		label: "Small radio button",
		size: "sm",
	},
};

export const MediumSize: Story = {
	args: {
		label: "Medium radio button",
		size: "md",
	},
};

export const LargeSize: Story = {
	args: {
		label: "Large radio button",
		size: "lg",
	},
};

export const Checked: Story = {
	args: {
		label: "Remember me",
		checked: true,
	},
};

export const WithoutLabel: Story = {
	args: {
		"aria-label": "Select this option",
	},
};

// Interactive example with state
const ControlledExample = () => {
	const [isChecked, setIsChecked] = useState(false);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<Radio
				checked={isChecked}
				helperText="Click to toggle the radio button"
				label="Controlled radio button"
				onChange={(e) => setIsChecked(e.target.checked)}
			/>
			<p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>
				<strong>Status:</strong> {isChecked ? "✅ Checked" : "⬜ Unchecked"}
			</p>
		</div>
	);
};

export const Controlled: Story = {
	render: () => <ControlledExample />,
	parameters: {
		docs: {
			description: {
				story: "Interactive example showing a controlled radio button with state management.",
			},
		},
	},
};

// Form validation example
const ValidationExample = () => {
	const [agreed, setAgreed] = useState(false);
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!agreed) {
			setError("You must accept the terms to continue");
			return;
		}

		setError("");
		setSubmitted(true);
		setTimeout(() => setSubmitted(false), 3000);
	};

	return (
		<form onSubmit={handleSubmit} style={{ width: "400px" }}>
			<Radio
				checked={agreed}
				error={error}
				label="I agree to the terms and conditions"
				onChange={(e) => {
					setAgreed(e.target.checked);
					setError("");
				}}
				required
			/>
			<button
				style={{
					marginTop: "1rem",
					padding: "0.5rem 1rem",
					backgroundColor: "#3b82f6",
					color: "white",
					border: "none",
					borderRadius: "0.5rem",
					cursor: "pointer",
				}}
				type="submit"
			>
				Submit
			</button>
			{submitted && (
				<p style={{ marginTop: "1rem", color: "#16a34a", fontSize: "0.875rem" }}>✅ Form submitted successfully!</p>
			)}
		</form>
	);
};

export const WithValidation: Story = {
	render: () => <ValidationExample />,
	parameters: {
		docs: {
			description: {
				story: "Interactive example showing validation. Try submitting without checking the box to see the error.",
			},
		},
	},
};

// Multiple checkboxes example
const MultipleCheckboxExample = () => {
	const [preferences, setPreferences] = useState({
		email: false,
		sms: false,
		push: false,
	});

	const handleChange = (key: keyof typeof preferences) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setPreferences({ ...preferences, [key]: e.target.checked });
	};

	return (
		<div style={{ width: "400px" }}>
			<h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600 }}>Notification Preferences</h3>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
				<Radio
					checked={preferences.email}
					helperText="Receive updates via email"
					label="Email notifications"
					onChange={handleChange("email")}
				/>
				<Radio
					checked={preferences.sms}
					helperText="Receive updates via SMS"
					label="SMS notifications"
					onChange={handleChange("sms")}
				/>
				<Radio
					checked={preferences.push}
					helperText="Receive push notifications"
					label="Push notifications"
					onChange={handleChange("push")}
				/>
			</div>
			<div
				style={{
					marginTop: "1rem",
					padding: "0.75rem",
					backgroundColor: "#f3f4f6",
					borderRadius: "0.5rem",
					fontSize: "0.875rem",
				}}
			>
				<strong>Selected:</strong>{" "}
				{Object.entries(preferences)
					.filter(([, value]) => value)
					.map(([key]) => key)
					.join(", ") || "None"}
			</div>
		</div>
	);
};

export const MultipleCheckboxes: Story = {
	render: () => <MultipleCheckboxExample />,
	parameters: {
		docs: {
			description: {
				story: "Example showing multiple radio buttons for selecting notification preferences.",
			},
		},
	},
};
