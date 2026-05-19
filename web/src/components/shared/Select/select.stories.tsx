import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./select";

const meta = {
	title: "Shared/Select",
	component: Select,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A flexible select component that extends native HTML select functionality with support for labels, errors, helper text, and multiple sizes. Built with CSS Modules and supports all native select props.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		label: {
			control: "text",
			description: "Label text for the select",
		},
		error: {
			control: "text",
			description: "Error message to display",
		},
		helperText: {
			control: "text",
			description: "Helper text to display below the select",
		},
		size: {
			control: "radio",
			options: ["sm", "md", "lg"],
			description: "Size variant of the select",
		},
		fullWidth: {
			control: "boolean",
			description: "Whether the select spans full width",
		},
		disabled: {
			control: "boolean",
			description: "Whether the select is disabled",
		},
		required: {
			control: "boolean",
			description: "Whether the select is required",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown as first disabled option",
		},
	},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Country",
		placeholder: "Select a country",
		children: (
			<>
				<option value="us">United States</option>
				<option value="ca">Canada</option>
				<option value="mx">Mexico</option>
				<option value="uk">United Kingdom</option>
				<option value="de">Germany</option>
				<option value="fr">France</option>
			</>
		),
	},
};

export const WithHelperText: Story = {
	args: {
		label: "Priority",
		placeholder: "Select priority level",
		helperText: "Choose the priority level for this task",
		children: (
			<>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
				<option value="urgent">Urgent</option>
			</>
		),
	},
};

export const WithError: Story = {
	args: {
		label: "Department",
		placeholder: "Select a department",
		error: "Please select a department",
		children: (
			<>
				<option value="engineering">Engineering</option>
				<option value="design">Design</option>
				<option value="marketing">Marketing</option>
				<option value="sales">Sales</option>
			</>
		),
	},
};

export const Required: Story = {
	args: {
		label: "Role",
		placeholder: "Select your role",
		required: true,
		helperText: "This field is required",
		children: (
			<>
				<option value="developer">Developer</option>
				<option value="designer">Designer</option>
				<option value="manager">Manager</option>
				<option value="other">Other</option>
			</>
		),
	},
};

export const Disabled: Story = {
	args: {
		label: "Status",
		disabled: true,
		value: "active",
		children: (
			<>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
				<option value="pending">Pending</option>
			</>
		),
	},
};

export const SmallSize: Story = {
	args: {
		label: "Filter",
		size: "sm",
		placeholder: "Filter by...",
		children: (
			<>
				<option value="all">All Items</option>
				<option value="active">Active</option>
				<option value="archived">Archived</option>
			</>
		),
	},
};

export const MediumSize: Story = {
	args: {
		label: "Category",
		size: "md",
		placeholder: "Select category",
		children: (
			<>
				<option value="tech">Technology</option>
				<option value="business">Business</option>
				<option value="health">Health</option>
			</>
		),
	},
};

export const LargeSize: Story = {
	args: {
		label: "Theme",
		size: "lg",
		placeholder: "Choose a theme",
		children: (
			<>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="auto">Auto</option>
			</>
		),
	},
};

export const FullWidth: Story = {
	args: {
		label: "Full Width Select",
		placeholder: "This select spans full width",
		fullWidth: true,
		children: (
			<>
				<option value="option1">Option 1</option>
				<option value="option2">Option 2</option>
				<option value="option3">Option 3</option>
			</>
		),
	},
	decorators: [
		(Story) => (
			<div style={{ width: "500px" }}>
				<Story />
			</div>
		),
	],
};

export const WithOptgroups: Story = {
	args: {
		label: "Location",
		placeholder: "Select a city",
		children: (
			<>
				<optgroup label="North America">
					<option value="nyc">New York</option>
					<option value="la">Los Angeles</option>
					<option value="toronto">Toronto</option>
				</optgroup>
				<optgroup label="Europe">
					<option value="london">London</option>
					<option value="paris">Paris</option>
					<option value="berlin">Berlin</option>
				</optgroup>
				<optgroup label="Asia">
					<option value="tokyo">Tokyo</option>
					<option value="singapore">Singapore</option>
					<option value="seoul">Seoul</option>
				</optgroup>
			</>
		),
	},
};

export const WithPreselectedValue: Story = {
	args: {
		label: "Language",
		defaultValue: "en",
		children: (
			<>
				<option value="en">English</option>
				<option value="es">Spanish</option>
				<option value="fr">French</option>
				<option value="de">German</option>
				<option value="ja">Japanese</option>
			</>
		),
	},
};

const ControlledExample = () => {
	const [value, setValue] = useState("");
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setValue(e.target.value);
		if (e.target.value) {
			setError("");
		}
	};

	const handleValidate = () => {
		if (!value) {
			setError("Please select a timezone");
		}
	};

	return (
		<div style={{ width: "400px" }}>
			<Select
				error={error}
				fullWidth
				helperText={!error ? "Select your preferred timezone" : undefined}
				label="Timezone"
				onBlur={handleValidate}
				onChange={handleChange}
				placeholder="Select timezone"
				required
				value={value}
			>
				<option value="pst">Pacific Standard Time (PST)</option>
				<option value="mst">Mountain Standard Time (MST)</option>
				<option value="cst">Central Standard Time (CST)</option>
				<option value="est">Eastern Standard Time (EST)</option>
				<option value="utc">Coordinated Universal Time (UTC)</option>
				<option value="gmt">Greenwich Mean Time (GMT)</option>
			</Select>
			<p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}>
				<strong>Selected value:</strong> {value || "None"}
			</p>
		</div>
	);
};

export const WithValidation: Story = {
	render: () => <ControlledExample />,
	parameters: {
		docs: {
			description: {
				story: "Interactive example showing controlled select with validation on blur.",
			},
		},
	},
};

const SettingsFormExample = () => {
	const [formData, setFormData] = useState({
		theme: "",
		language: "",
		timezone: "",
		notifications: "",
		privacy: "",
	});

	const [errors, setErrors] = useState({
		theme: "",
		language: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = { theme: "", language: "" };

		if (!formData.theme) {
			newErrors.theme = "Please select a theme";
		}

		if (!formData.language) {
			newErrors.language = "Please select a language";
		}

		setErrors(newErrors);

		if (!Object.values(newErrors).some((error) => error)) {
			alert("Settings saved successfully!");
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ width: "500px", display: "flex", flexDirection: "column", gap: "1rem" }}>
			<h3 style={{ margin: 0, marginBottom: "0.5rem" }}>Settings</h3>

			<Select
				error={errors.theme}
				fullWidth
				label="Theme"
				onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
				placeholder="Select theme"
				required
				value={formData.theme}
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="auto">Auto (System)</option>
			</Select>

			<Select
				error={errors.language}
				fullWidth
				label="Language"
				onChange={(e) => setFormData({ ...formData, language: e.target.value })}
				placeholder="Select language"
				required
				value={formData.language}
			>
				<option value="en">English</option>
				<option value="es">Español</option>
				<option value="fr">Français</option>
				<option value="de">Deutsch</option>
				<option value="ja">日本語</option>
			</Select>

			<Select
				fullWidth
				helperText="Select your local timezone"
				label="Timezone"
				onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
				placeholder="Select timezone"
				value={formData.timezone}
			>
				<optgroup label="US Timezones">
					<option value="pst">Pacific Standard Time</option>
					<option value="mst">Mountain Standard Time</option>
					<option value="cst">Central Standard Time</option>
					<option value="est">Eastern Standard Time</option>
				</optgroup>
				<optgroup label="Other">
					<option value="utc">UTC</option>
					<option value="gmt">GMT</option>
				</optgroup>
			</Select>

			<Select
				fullWidth
				helperText="How often would you like to receive notifications?"
				label="Notifications"
				onChange={(e) => setFormData({ ...formData, notifications: e.target.value })}
				placeholder="Select frequency"
				value={formData.notifications}
			>
				<option value="realtime">Real-time</option>
				<option value="hourly">Hourly digest</option>
				<option value="daily">Daily digest</option>
				<option value="weekly">Weekly digest</option>
				<option value="never">Never</option>
			</Select>

			<Select
				fullWidth
				label="Privacy"
				onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
				placeholder="Select privacy level"
				value={formData.privacy}
			>
				<option value="public">Public</option>
				<option value="friends">Friends only</option>
				<option value="private">Private</option>
			</Select>

			<button
				style={{
					padding: "0.75rem 1.5rem",
					backgroundColor: "#3b82f6",
					color: "white",
					border: "none",
					borderRadius: "0.5rem",
					fontSize: "1rem",
					fontWeight: 500,
					cursor: "pointer",
				}}
				type="submit"
			>
				Save Settings
			</button>
		</form>
	);
};

export const FormExample: Story = {
	render: () => <SettingsFormExample />,
	parameters: {
		docs: {
			description: {
				story: "Complete form example showing multiple Select components working together with validation.",
			},
		},
	},
};
