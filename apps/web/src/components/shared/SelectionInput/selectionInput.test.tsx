import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { SelectionInput } from "./selectionInput";

describe("SelectionInput", () => {
	describe("Basic Rendering", () => {
		it("should render checkbox variant", () => {
			render(<SelectionInput variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute("type", "checkbox");
		});

		it("should render radio variant", () => {
			render(<SelectionInput variant="radio" />);
			const input = screen.getByRole("radio");
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute("type", "radio");
		});

		it("should render with label", () => {
			render(<SelectionInput label="Accept terms" variant="checkbox" />);
			expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
		});

		it("should render with helper text", () => {
			render(<SelectionInput helperText="This is required" label="Accept terms" variant="checkbox" />);
			expect(screen.getByText("This is required")).toBeInTheDocument();
		});

		it("should render with error message", () => {
			render(<SelectionInput error="You must accept" label="Accept terms" variant="checkbox" />);
			expect(screen.getByText("You must accept")).toBeInTheDocument();
		});

		it("should show error instead of helper text when both are provided", () => {
			render(<SelectionInput error="Invalid" helperText="Helper text" label="Accept terms" variant="checkbox" />);
			expect(screen.getByText("Invalid")).toBeInTheDocument();
			expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
		});
	});

	describe("Required Field", () => {
		it("should render required indicator when required prop is true", () => {
			render(<SelectionInput label="Accept terms" required variant="checkbox" />);
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("should not render required indicator when required is false", () => {
			render(<SelectionInput label="Accept terms" variant="checkbox" />);
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});
	});

	describe("Size Variants", () => {
		it("should render checkbox with small size", () => {
			render(<SelectionInput size="sm" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input.className).toContain("input--sm");
		});

		it("should render checkbox with medium size by default", () => {
			render(<SelectionInput variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input.className).toContain("input--md");
		});

		it("should render checkbox with large size", () => {
			render(<SelectionInput size="lg" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input.className).toContain("input--lg");
		});

		it("should render radio with small size", () => {
			render(<SelectionInput size="sm" variant="radio" />);
			const input = screen.getByRole("radio");
			expect(input.className).toContain("input--sm");
		});

		it("should render radio with medium size by default", () => {
			render(<SelectionInput variant="radio" />);
			const input = screen.getByRole("radio");
			expect(input.className).toContain("input--md");
		});

		it("should render radio with large size", () => {
			render(<SelectionInput size="lg" variant="radio" />);
			const input = screen.getByRole("radio");
			expect(input.className).toContain("input--lg");
		});
	});

	describe("Variant-specific Styling", () => {
		it("should apply checkbox variant class", () => {
			render(<SelectionInput variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input.className).toContain("input--checkbox");
		});

		it("should apply radio variant class", () => {
			render(<SelectionInput variant="radio" />);
			const input = screen.getByRole("radio");
			expect(input.className).toContain("input--radio");
		});
	});

	describe("States", () => {
		it("should render as disabled when disabled prop is true", () => {
			render(<SelectionInput disabled variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toBeDisabled();
			expect(input.className).toContain("input--disabled");
		});

		it("should have error styling when error is provided", () => {
			render(<SelectionInput error="Error message" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input.className).toContain("input--error");
		});

		it("should have aria-invalid when error is provided", () => {
			render(<SelectionInput error="Invalid" label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			expect(input).toHaveAttribute("aria-invalid", "true");
		});

		it("should not have aria-invalid when no error", () => {
			render(<SelectionInput label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			expect(input).toHaveAttribute("aria-invalid", "false");
		});

		it("should render as checked when checked prop is true", () => {
			render(<SelectionInput checked onChange={() => {}} variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toBeChecked();
		});

		it("should render as unchecked by default", () => {
			render(<SelectionInput variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).not.toBeChecked();
		});
	});

	describe("User Interactions - Checkbox", () => {
		it("should handle onChange event for checkbox", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<SelectionInput onChange={handleChange} variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			await user.click(input);

			expect(handleChange).toHaveBeenCalled();
			expect(input).toBeChecked();
		});

		it("should toggle checked state when checkbox is clicked", async () => {
			const user = userEvent.setup();

			render(<SelectionInput variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			expect(input).not.toBeChecked();

			await user.click(input);
			expect(input).toBeChecked();

			await user.click(input);
			expect(input).not.toBeChecked();
		});

		it("should toggle checkbox when label is clicked", async () => {
			const user = userEvent.setup();

			render(<SelectionInput label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			const label = screen.getByText("Accept terms");

			expect(input).not.toBeChecked();

			await user.click(label);
			expect(input).toBeChecked();
		});
	});

	describe("User Interactions - Radio", () => {
		it("should handle onChange event for radio", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<SelectionInput name="test" onChange={handleChange} variant="radio" />);
			const input = screen.getByRole("radio");

			await user.click(input);

			expect(handleChange).toHaveBeenCalled();
			expect(input).toBeChecked();
		});

		it("should check radio when clicked", async () => {
			const user = userEvent.setup();

			render(<SelectionInput name="test" variant="radio" />);
			const input = screen.getByRole("radio");

			expect(input).not.toBeChecked();

			await user.click(input);
			expect(input).toBeChecked();
		});

		it("should toggle radio when label is clicked", async () => {
			const user = userEvent.setup();

			render(<SelectionInput label="Option 1" name="test" variant="radio" />);
			const input = screen.getByLabelText("Option 1");
			const label = screen.getByText("Option 1");

			expect(input).not.toBeChecked();

			await user.click(label);
			expect(input).toBeChecked();
		});
	});

	describe("Common Interactions", () => {
		it("should handle onBlur event", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();

			render(<SelectionInput onBlur={handleBlur} variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			await user.click(input);
			await user.tab();

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should handle onFocus event", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();

			render(<SelectionInput onFocus={handleFocus} variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			await user.click(input);

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should not toggle when disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<SelectionInput disabled onChange={handleChange} variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			await user.click(input);

			expect(handleChange).not.toHaveBeenCalled();
			expect(input).not.toBeChecked();
		});
	});

	describe("Accessibility", () => {
		it("should associate label with input via htmlFor", () => {
			render(<SelectionInput label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			expect(input).toBeInTheDocument();
		});

		it("should have aria-describedby pointing to error when error exists", () => {
			render(<SelectionInput error="Invalid" label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			const errorId = input.getAttribute("aria-describedby");
			expect(errorId).toBeTruthy();
			expect(screen.getByText("Invalid")).toHaveAttribute("id", errorId);
		});

		it("should have aria-describedby pointing to helper text when provided", () => {
			render(<SelectionInput helperText="This is required" label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			const helperId = input.getAttribute("aria-describedby");
			expect(helperId).toBeTruthy();
			expect(screen.getByText("This is required")).toHaveAttribute("id", helperId);
		});

		it("should have role alert on error message", () => {
			render(<SelectionInput error="Invalid" label="Accept terms" variant="checkbox" />);
			const errorMessage = screen.getByText("Invalid");
			expect(errorMessage).toHaveAttribute("role", "alert");
		});

		it("should not have role alert on helper text", () => {
			render(<SelectionInput helperText="This is required" label="Accept terms" variant="checkbox" />);
			const helperText = screen.getByText("This is required");
			expect(helperText).not.toHaveAttribute("role", "alert");
		});

		it("should support aria-label when no label is provided", () => {
			render(<SelectionInput aria-label="Accept terms and conditions" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms and conditions");
			expect(input).toBeInTheDocument();
		});
	});

	describe("Custom Props", () => {
		it("should accept and apply custom className", () => {
			render(<SelectionInput className="custom-class" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input.className).toContain("custom-class");
		});

		it("should forward ref to input element", () => {
			const ref = vi.fn();
			render(<SelectionInput ref={ref} variant="checkbox" />);
			expect(ref).toHaveBeenCalled();
		});

		it("should accept custom id", () => {
			// biome-ignore lint/correctness/useUniqueElementIds: testing custom id assignment
			render(<SelectionInput id="custom-id" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toHaveAttribute("id", "custom-id");
		});

		it("should generate id when id is not provided", () => {
			render(<SelectionInput label="Accept terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			expect(input).toHaveAttribute("id");
			expect(input.getAttribute("id")).toBeTruthy();
		});

		it("should accept name attribute", () => {
			render(<SelectionInput label="Accept terms" name="terms" variant="checkbox" />);
			const input = screen.getByLabelText("Accept terms");
			expect(input).toHaveAttribute("name", "terms");
		});

		it("should accept value attribute", () => {
			render(<SelectionInput label="Option A" value="optionA" variant="checkbox" />);
			const input = screen.getByLabelText("Option A");
			expect(input).toHaveAttribute("value", "optionA");
		});
	});

	describe("Controlled Component", () => {
		it("should work as controlled checkbox", async () => {
			const user = userEvent.setup();
			const TestComponent = () => {
				const [checked, setChecked] = React.useState(false);
				return <SelectionInput checked={checked} onChange={(e) => setChecked(e.target.checked)} variant="checkbox" />;
			};

			render(<TestComponent />);
			const input = screen.getByRole("checkbox");

			expect(input).not.toBeChecked();

			await user.click(input);
			expect(input).toBeChecked();

			await user.click(input);
			expect(input).not.toBeChecked();
		});

		it("should respect controlled checked value", () => {
			const { rerender } = render(<SelectionInput checked={false} onChange={() => {}} variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).not.toBeChecked();

			rerender(<SelectionInput checked onChange={() => {}} variant="checkbox" />);
			expect(input).toBeChecked();
		});
	});

	describe("Uncontrolled Component", () => {
		it("should work as uncontrolled component with defaultChecked", () => {
			render(<SelectionInput defaultChecked variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toBeChecked();
		});

		it("should toggle uncontrolled input", async () => {
			const user = userEvent.setup();
			render(<SelectionInput defaultChecked={false} variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			expect(input).not.toBeChecked();

			await user.click(input);
			expect(input).toBeChecked();
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty label gracefully", () => {
			render(<SelectionInput label="" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toBeInTheDocument();
		});

		it("should handle long error messages", () => {
			const longError =
				"This is a very long error message that should still render properly and be accessible to users";
			render(<SelectionInput error={longError} label="Accept terms" variant="checkbox" />);
			expect(screen.getByText(longError)).toBeInTheDocument();
		});

		it("should handle special characters in label", () => {
			render(<SelectionInput label="I accept the terms & conditions" variant="checkbox" />);
			expect(screen.getByLabelText("I accept the terms & conditions")).toBeInTheDocument();
		});

		it("should render without label", () => {
			render(<SelectionInput aria-label="Hidden input" variant="checkbox" />);
			const input = screen.getByRole("checkbox");
			expect(input).toBeInTheDocument();
		});

		it("should handle rapid clicks", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<SelectionInput onChange={handleChange} variant="checkbox" />);
			const input = screen.getByRole("checkbox");

			await user.click(input);
			await user.click(input);
			await user.click(input);

			expect(handleChange).toHaveBeenCalledTimes(3);
		});
	});

	describe("Radio Group Behavior", () => {
		it("should handle radio group with same name", async () => {
			const user = userEvent.setup();

			render(
				<div>
					<SelectionInput label="Option 1" name="group" variant="radio" />
					<SelectionInput label="Option 2" name="group" variant="radio" />
					<SelectionInput label="Option 3" name="group" variant="radio" />
				</div>
			);

			const radio1 = screen.getByLabelText("Option 1");
			const radio2 = screen.getByLabelText("Option 2");

			await user.click(radio1);
			expect(radio1).toBeChecked();
			expect(radio2).not.toBeChecked();

			await user.click(radio2);
			expect(radio1).not.toBeChecked();
			expect(radio2).toBeChecked();
		});
	});
});
