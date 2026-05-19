import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectionInput } from "./selectionInput";

const meta = {
	title: "Shared/SelectionInput",
	component: SelectionInput,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A unified selection input component that supports both checkbox and radio variants. Built with CSS Modules and supports all native input props. This component serves as the foundation for both Checkbox and Radio components.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "radio",
			options: ["checkbox", "radio"],
			description: "The type of selection input",
		},
		label: {
			control: "text",
			description: "Label text for the input",
		},
		error: {
			control: "text",
			description: "Error message to display",
		},
		helperText: {
			control: "text",
			description: "Helper text to display below the input",
		},
		size: {
			control: "radio",
			options: ["sm", "md", "lg"],
			description: "Size variant of the input",
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled",
		},
		required: {
			control: "boolean",
			description: "Whether the input is required",
		},
		checked: {
			control: "boolean",
			description: "Whether the input is checked",
		},
	},
} satisfies Meta<typeof SelectionInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Checkbox variant stories
export const CheckboxDefault: Story = {
	args: {
		variant: "checkbox",
		label: "Accept terms and conditions",
	},
};

export const CheckboxWithHelperText: Story = {
	args: {
		variant: "checkbox",
		label: "Subscribe to newsletter",
		helperText: "We'll send you weekly updates about new features",
	},
};

export const CheckboxWithError: Story = {
	args: {
		variant: "checkbox",
		label: "Accept terms and conditions",
		error: "You must accept the terms to continue",
	},
};

export const CheckboxDisabled: Story = {
	args: {
		variant: "checkbox",
		label: "Disabled option",
		disabled: true,
	},
};

export const CheckboxSizes: Story = {
	args: {
		variant: "checkbox",
	},
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<SelectionInput label="Small checkbox" size="sm" variant="checkbox" />
			<SelectionInput label="Medium checkbox" size="md" variant="checkbox" />
			<SelectionInput label="Large checkbox" size="lg" variant="checkbox" />
		</div>
	),
};

// Radio variant stories
export const RadioDefault: Story = {
	args: {
		variant: "radio",
		label: "Option 1",
		name: "radio-group",
	},
};

export const RadioWithHelperText: Story = {
	args: {
		variant: "radio",
		label: "Premium plan",
		helperText: "Best for growing teams",
		name: "plan",
	},
};

export const RadioWithError: Story = {
	args: {
		variant: "radio",
		label: "Select this option",
		error: "Please select an option to continue",
		name: "required-radio",
	},
};

export const RadioDisabled: Story = {
	args: {
		variant: "radio",
		label: "Disabled option",
		disabled: true,
		name: "radio-disabled",
	},
};

export const RadioSizes: Story = {
	args: {
		variant: "radio",
	},
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
			<SelectionInput label="Small radio" name="size-demo" size="sm" variant="radio" />
			<SelectionInput label="Medium radio" name="size-demo" size="md" variant="radio" />
			<SelectionInput label="Large radio" name="size-demo" size="lg" variant="radio" />
		</div>
	),
};

// Radio group example
const RadioGroupExample = () => {
	const [selectedPlan, setSelectedPlan] = useState("basic");

	return (
		<div style={{ width: "400px" }}>
			<h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600 }}>Select a plan</h3>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
				<SelectionInput
					checked={selectedPlan === "basic"}
					helperText="Perfect for individuals"
					label="Basic - $9/month"
					name="plan"
					onChange={() => setSelectedPlan("basic")}
					variant="radio"
				/>
				<SelectionInput
					checked={selectedPlan === "pro"}
					helperText="Best for professionals"
					label="Pro - $29/month"
					name="plan"
					onChange={() => setSelectedPlan("pro")}
					variant="radio"
				/>
				<SelectionInput
					checked={selectedPlan === "enterprise"}
					helperText="For large organizations"
					label="Enterprise - $99/month"
					name="plan"
					onChange={() => setSelectedPlan("enterprise")}
					variant="radio"
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
				<strong>Selected plan:</strong> {selectedPlan}
			</div>
		</div>
	);
};

export const RadioGroup: Story = {
	args: {
		variant: "radio",
	},
	render: () => <RadioGroupExample />,
	parameters: {
		docs: {
			description: {
				story: "Example showing a radio button group for plan selection.",
			},
		},
	},
};

// Checkbox group example
const CheckboxGroupExample = () => {
	const [features, setFeatures] = useState({
		analytics: false,
		api: false,
		support: false,
	});

	const handleChange = (key: keyof typeof features) => (e: React.ChangeEvent<HTMLInputElement>) => {
		setFeatures({ ...features, [key]: e.target.checked });
	};

	return (
		<div style={{ width: "400px" }}>
			<h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600 }}>Select features</h3>
			<div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
				<SelectionInput
					checked={features.analytics}
					helperText="Track user behavior and metrics"
					label="Advanced Analytics"
					onChange={handleChange("analytics")}
					variant="checkbox"
				/>
				<SelectionInput
					checked={features.api}
					helperText="RESTful API access"
					label="API Access"
					onChange={handleChange("api")}
					variant="checkbox"
				/>
				<SelectionInput
					checked={features.support}
					helperText="24/7 priority support"
					label="Premium Support"
					onChange={handleChange("support")}
					variant="checkbox"
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
				<strong>Selected features:</strong>{" "}
				{Object.entries(features)
					.filter(([, value]) => value)
					.map(([key]) => key)
					.join(", ") || "None"}
			</div>
		</div>
	);
};

export const CheckboxGroup: Story = {
	args: {
		variant: "checkbox",
	},
	render: () => <CheckboxGroupExample />,
	parameters: {
		docs: {
			description: {
				story: "Example showing multiple checkboxes for feature selection.",
			},
		},
	},
};

// Comparison example
export const Comparison: Story = {
	args: {
		variant: "checkbox",
	},
	render: () => (
		<div style={{ display: "flex", gap: "3rem" }}>
			<div>
				<h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", fontWeight: 600 }}>Checkbox</h4>
				<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
					<SelectionInput label="Option 1" variant="checkbox" />
					<SelectionInput label="Option 2" variant="checkbox" />
					<SelectionInput label="Option 3" variant="checkbox" />
				</div>
			</div>
			<div>
				<h4 style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", fontWeight: 600 }}>Radio</h4>
				<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
					<SelectionInput label="Option 1" name="comparison" variant="radio" />
					<SelectionInput label="Option 2" name="comparison" variant="radio" />
					<SelectionInput label="Option 3" name="comparison" variant="radio" />
				</div>
			</div>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: "Side-by-side comparison of checkbox and radio variants.",
			},
		},
	},
};
