import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Input } from "./input";

const meta = {
	title: "Shared/Input",
	component: Input,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A flexible input component that extends native HTML input functionality with support for labels, errors, helper text, and multiple sizes. Built with CSS Modules and supports all native input props.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
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
		fullWidth: {
			control: "boolean",
			description: "Whether the input spans full width",
		},
		disabled: {
			control: "boolean",
			description: "Whether the input is disabled",
		},
		required: {
			control: "boolean",
			description: "Whether the input is required",
		},
		type: {
			control: "text",
			description: "HTML input type",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text",
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: "Email",
		type: "email",
		placeholder: "Enter your email",
	},
};

export const WithHelperText: Story = {
	args: {
		label: "Username",
		type: "text",
		placeholder: "Choose a username",
		helperText: "Must be 3-20 characters long",
	},
};

export const WithError: Story = {
	args: {
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
		error: "Password must be at least 8 characters",
	},
};

export const Required: Story = {
	args: {
		label: "Full Name",
		type: "text",
		placeholder: "John Doe",
		required: true,
		helperText: "This field is required",
	},
};

export const Disabled: Story = {
	args: {
		label: "Email",
		type: "email",
		value: "user@example.com",
		disabled: true,
	},
};

export const SmallSize: Story = {
	args: {
		label: "Search",
		type: "search",
		placeholder: "Search...",
		size: "sm",
	},
};

export const MediumSize: Story = {
	args: {
		label: "Email",
		type: "email",
		placeholder: "Enter your email",
		size: "md",
	},
};

export const LargeSize: Story = {
	args: {
		label: "Title",
		type: "text",
		placeholder: "Enter a title",
		size: "lg",
	},
};

export const FullWidth: Story = {
	args: {
		label: "Full Width Input",
		type: "text",
		placeholder: "This input spans full width",
		fullWidth: true,
	},
	decorators: [
		(Story) => (
			<div style={{ width: "500px" }}>
				<Story />
			</div>
		),
	],
};

export const NumberInput: Story = {
	args: {
		label: "Age",
		type: "number",
		placeholder: "Enter your age",
		min: 0,
		max: 120,
	},
};

export const PasswordInput: Story = {
	args: {
		label: "Password",
		type: "password",
		placeholder: "Enter your password",
		helperText: "Must contain at least 8 characters",
	},
};

export const SearchInput: Story = {
	args: {
		label: "Search",
		type: "search",
		placeholder: "Search articles...",
	},
};

export const DateInput: Story = {
	args: {
		label: "Birth Date",
		type: "date",
	},
};

export const TelInput: Story = {
	args: {
		label: "Phone Number",
		type: "tel",
		placeholder: "+1 (555) 123-4567",
		helperText: "Format: +1 (555) 123-4567",
	},
};

export const UrlInput: Story = {
	args: {
		label: "Website",
		type: "url",
		placeholder: "https://example.com",
		helperText: "Enter a valid URL starting with http:// or https://",
	},
};

// Interactive example with validation
const ValidationExample = () => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");

	const validateEmail = (value: string) => {
		if (!value) {
			setError("Email is required");
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setError("Please enter a valid email address");
		} else {
			setError("");
		}
	};

	return (
		<div style={{ width: "400px" }}>
			<Input
				error={error}
				fullWidth
				helperText={!error ? "We'll never share your email with anyone else" : undefined}
				label="Email Address"
				onBlur={() => validateEmail(email)}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="user@example.com"
				required
				type="email"
				value={email}
			/>
			<p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}>
				<strong>Validation status:</strong>{" "}
				{error ? (
					<span style={{ color: "#dc2626" }}>❌ Invalid</span>
				) : email ? (
					<span style={{ color: "#16a34a" }}>✅ Valid</span>
				) : (
					<span>⏳ Waiting for input</span>
				)}
			</p>
		</div>
	);
};

export const WithValidation: Story = {
	render: () => <ValidationExample />,
	parameters: {
		docs: {
			description: {
				story:
					"Interactive example showing real-time validation. The input validates on blur and displays appropriate error messages.",
			},
		},
	},
};

const RegistrationFormExample = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors = { email: "", password: "", confirmPassword: "" };

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Invalid email address";
		}

		if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);

		if (!Object.values(newErrors).some((error) => error)) {
			alert("Form submitted successfully!");
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ width: "500px", display: "flex", flexDirection: "column", gap: "1rem" }}>
			<h3 style={{ margin: 0, marginBottom: "0.5rem" }}>Registration Form</h3>

			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
				<Input
					fullWidth
					label="First Name"
					onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
					placeholder="John"
					required
					type="text"
					value={formData.firstName}
				/>
				<Input
					fullWidth
					label="Last Name"
					onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
					placeholder="Doe"
					required
					type="text"
					value={formData.lastName}
				/>
			</div>

			<Input
				error={errors.email}
				fullWidth
				label="Email"
				onChange={(e) => setFormData({ ...formData, email: e.target.value })}
				placeholder="john.doe@example.com"
				required
				type="email"
				value={formData.email}
			/>

			<Input
				fullWidth
				helperText="Format: +1 (555) 123-4567"
				label="Phone"
				onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
				placeholder="+1 (555) 123-4567"
				type="tel"
				value={formData.phone}
			/>

			<Input
				error={errors.password}
				fullWidth
				helperText={!errors.password ? "Must be at least 8 characters" : undefined}
				label="Password"
				onChange={(e) => setFormData({ ...formData, password: e.target.value })}
				placeholder="Enter password"
				required
				type="password"
				value={formData.password}
			/>

			<Input
				error={errors.confirmPassword}
				fullWidth
				label="Confirm Password"
				onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
				placeholder="Re-enter password"
				required
				type="password"
				value={formData.confirmPassword}
			/>

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
				Create Account
			</button>
		</form>
	);
};

export const FormExample: Story = {
	render: () => <RegistrationFormExample />,
	parameters: {
		docs: {
			description: {
				story: "Complete form example showing multiple Input components working together with validation.",
			},
		},
	},
};
