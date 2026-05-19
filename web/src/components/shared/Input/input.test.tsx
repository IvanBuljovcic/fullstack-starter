import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";

describe("Input", () => {
	describe("Basic Rendering", () => {
		it("should render input element", () => {
			render(<Input />);
			const input = screen.getByRole("textbox");
			expect(input).toBeInTheDocument();
		});

		it("should render with label", () => {
			render(<Input label="Email" />);
			expect(screen.getByLabelText("Email")).toBeInTheDocument();
		});

		it("should render with placeholder", () => {
			render(<Input placeholder="Enter email" />);
			expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
		});

		it("should render with helper text", () => {
			render(<Input helperText="Must be 3-20 characters" label="Username" />);
			expect(screen.getByText("Must be 3-20 characters")).toBeInTheDocument();
		});

		it("should render with error message", () => {
			render(<Input error="Password is required" label="Password" />);
			expect(screen.getByText("Password is required")).toBeInTheDocument();
		});

		it("should show error instead of helper text when both are provided", () => {
			render(<Input error="Invalid email" helperText="Enter your email" label="Email" />);
			expect(screen.getByText("Invalid email")).toBeInTheDocument();
			expect(screen.queryByText("Enter your email")).not.toBeInTheDocument();
		});
	});

	describe("Required Field", () => {
		it("should render required indicator when required prop is true", () => {
			render(<Input label="Name" required />);
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("should not render required indicator when required is false", () => {
			render(<Input label="Name" />);
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});
	});

	describe("Size Variants", () => {
		it("should render with small size", () => {
			render(<Input size="sm" />);
			const input = screen.getByRole("textbox");
			expect(input.className).toContain("input--sm");
		});

		it("should render with medium size by default", () => {
			render(<Input />);
			const input = screen.getByRole("textbox");
			expect(input.className).toContain("input--md");
		});

		it("should render with large size", () => {
			render(<Input size="lg" />);
			const input = screen.getByRole("textbox");
			expect(input.className).toContain("input--lg");
		});
	});

	describe("Full Width", () => {
		it("should apply full width class when fullWidth is true", () => {
			render(<Input fullWidth />);
			const input = screen.getByRole("textbox");
			expect(input.className).toContain("input--fullWidth");
		});

		it("should not apply full width class by default", () => {
			render(<Input />);
			const input = screen.getByRole("textbox");
			expect(input.className).not.toContain("input--fullWidth");
		});
	});

	describe("States", () => {
		it("should render as disabled when disabled prop is true", () => {
			render(<Input disabled />);
			const input = screen.getByRole("textbox");
			expect(input).toBeDisabled();
			expect(input.className).toContain("input--disabled");
		});

		it("should have error styling when error is provided", () => {
			render(<Input error="Error message" />);
			const input = screen.getByRole("textbox");
			expect(input.className).toContain("input--error");
		});

		it("should have aria-invalid when error is provided", () => {
			render(<Input error="Invalid email" label="Email" />);
			const input = screen.getByLabelText("Email");
			expect(input).toHaveAttribute("aria-invalid", "true");
		});

		it("should not have aria-invalid when no error", () => {
			render(<Input label="Email" />);
			const input = screen.getByLabelText("Email");
			expect(input).toHaveAttribute("aria-invalid", "false");
		});
	});

	describe("Input Types", () => {
		it("should render email input", () => {
			render(<Input type="email" />);
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("type", "email");
		});

		it("should render password input", () => {
			render(<Input label="Password" type="password" />);
			const input = screen.getByLabelText("Password");
			expect(input).toHaveAttribute("type", "password");
		});

		it("should render number input", () => {
			render(<Input label="Age" type="number" />);
			const input = screen.getByLabelText("Age");
			expect(input).toHaveAttribute("type", "number");
		});

		it("should render search input", () => {
			render(<Input type="search" />);
			const input = screen.getByRole("searchbox");
			expect(input).toBeInTheDocument();
		});
	});

	describe("User Interactions", () => {
		it("should handle onChange event", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<Input onChange={handleChange} />);
			const input = screen.getByRole("textbox");

			await user.type(input, "test");

			expect(handleChange).toHaveBeenCalled();
			expect(input).toHaveValue("test");
		});

		it("should handle onBlur event", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();

			render(<Input onBlur={handleBlur} />);
			const input = screen.getByRole("textbox");

			await user.click(input);
			await user.tab();

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should handle onFocus event", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();

			render(<Input onFocus={handleFocus} />);
			const input = screen.getByRole("textbox");

			await user.click(input);

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});
	});

	describe("Accessibility", () => {
		it("should associate label with input via htmlFor", () => {
			render(<Input label="Email" />);
			const input = screen.getByLabelText("Email");
			expect(input).toBeInTheDocument();
		});

		it("should have aria-describedby pointing to error when error exists", () => {
			render(<Input error="Invalid email" label="Email" />);
			const input = screen.getByLabelText("Email");
			const errorId = input.getAttribute("aria-describedby");
			expect(errorId).toBeTruthy();
			expect(screen.getByText("Invalid email")).toHaveAttribute("id", errorId);
		});

		it("should have aria-describedby pointing to helper text when provided", () => {
			render(<Input helperText="3-20 characters" label="Username" />);
			const input = screen.getByLabelText("Username");
			const helperId = input.getAttribute("aria-describedby");
			expect(helperId).toBeTruthy();
			expect(screen.getByText("3-20 characters")).toHaveAttribute("id", helperId);
		});

		it("should have role alert on error message", () => {
			render(<Input error="Invalid email" label="Email" />);
			const errorMessage = screen.getByText("Invalid email");
			expect(errorMessage).toHaveAttribute("role", "alert");
		});

		it("should not have role alert on helper text", () => {
			render(<Input helperText="Enter your email" label="Email" />);
			const helperText = screen.getByText("Enter your email");
			expect(helperText).not.toHaveAttribute("role", "alert");
		});
	});

	describe("Custom Props", () => {
		it("should accept and apply custom className", () => {
			render(<Input className="custom-class" />);
			const input = screen.getByRole("textbox");
			expect(input.className).toContain("custom-class");
		});

		it("should forward ref to input element", () => {
			const ref = vi.fn();
			render(<Input ref={ref} />);
			expect(ref).toHaveBeenCalled();
		});

		it("should accept custom id", () => {
			// biome-ignore lint/correctness/useUniqueElementIds: testing custom id assignment
			render(<Input id="custom-id" />);
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("id", "custom-id");
		});

		it("should generate id when id is not provided", () => {
			render(<Input label="First Name" />);
			const input = screen.getByLabelText("First Name");
			expect(input).toHaveAttribute("id");
			expect(input.getAttribute("id")).toBeTruthy();
		});

		it("should accept min and max for number input", () => {
			render(<Input label="Age" max={100} min={0} type="number" />);
			const input = screen.getByLabelText("Age");
			expect(input).toHaveAttribute("min", "0");
			expect(input).toHaveAttribute("max", "100");
		});

		it("should accept maxLength", () => {
			render(<Input label="Bio" maxLength={50} />);
			const input = screen.getByLabelText("Bio");
			expect(input).toHaveAttribute("maxLength", "50");
		});

		it("should accept pattern", () => {
			render(<Input label="Phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />);
			const input = screen.getByLabelText("Phone");
			expect(input).toHaveAttribute("pattern", "[0-9]{3}-[0-9]{3}-[0-9]{4}");
		});
	});

	describe("Value Handling", () => {
		it("should render with initial value", () => {
			render(<Input onChange={() => {}} value="initial value" />);
			const input = screen.getByRole("textbox");
			expect(input).toHaveValue("initial value");
		});

		it("should work as controlled component", async () => {
			const user = userEvent.setup();
			const TestComponent = () => {
				const [value, setValue] = React.useState("");
				return <Input onChange={(e) => setValue(e.target.value)} value={value} />;
			};

			render(<TestComponent />);
			const input = screen.getByRole("textbox");

			await user.type(input, "controlled");
			expect(input).toHaveValue("controlled");
		});

		it("should work as uncontrolled component", async () => {
			const user = userEvent.setup();
			render(<Input defaultValue="uncontrolled" />);
			const input = screen.getByRole("textbox");

			expect(input).toHaveValue("uncontrolled");

			await user.clear(input);
			await user.type(input, "new value");
			expect(input).toHaveValue("new value");
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty label gracefully", () => {
			render(<Input label="" />);
			const input = screen.getByRole("textbox");
			expect(input).toBeInTheDocument();
		});

		it("should handle long error messages", () => {
			const longError =
				"This is a very long error message that should still render properly and be accessible to users";
			render(<Input error={longError} label="Email" />);
			expect(screen.getByText(longError)).toBeInTheDocument();
		});

		it("should handle special characters in label", () => {
			render(<Input label="Email (required)" />);
			expect(screen.getByLabelText("Email (required)")).toBeInTheDocument();
		});
	});
});
