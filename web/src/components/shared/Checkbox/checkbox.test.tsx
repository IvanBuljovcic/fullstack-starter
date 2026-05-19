import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
	describe("Basic Rendering", () => {
		it("should render checkbox element", () => {
			render(<Checkbox />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeInTheDocument();
		});

		it("should render with label", () => {
			render(<Checkbox label="Accept terms" />);
			expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
		});

		it("should render with helper text", () => {
			render(<Checkbox helperText="This is required" label="Accept terms" />);
			expect(screen.getByText("This is required")).toBeInTheDocument();
		});

		it("should render with error message", () => {
			render(<Checkbox error="You must accept" label="Accept terms" />);
			expect(screen.getByText("You must accept")).toBeInTheDocument();
		});

		it("should show error instead of helper text when both are provided", () => {
			render(<Checkbox error="Invalid" helperText="Helper text" label="Accept terms" />);
			expect(screen.getByText("Invalid")).toBeInTheDocument();
			expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
		});
	});

	describe("Required Field", () => {
		it("should render required indicator when required prop is true", () => {
			render(<Checkbox label="Accept terms" required />);
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("should not render required indicator when required is false", () => {
			render(<Checkbox label="Accept terms" />);
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});
	});

	describe("Size Variants", () => {
		it("should render with small size", () => {
			render(<Checkbox size="sm" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox.className).toContain("input--sm");
		});

		it("should render with medium size by default", () => {
			render(<Checkbox />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox.className).toContain("input--md");
		});

		it("should render with large size", () => {
			render(<Checkbox size="lg" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox.className).toContain("input--lg");
		});
	});

	describe("States", () => {
		it("should render as disabled when disabled prop is true", () => {
			render(<Checkbox disabled />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeDisabled();
			expect(checkbox.className).toContain("input--disabled");
		});

		it("should have error styling when error is provided", () => {
			render(<Checkbox error="Error message" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox.className).toContain("input--error");
		});

		it("should have aria-invalid when error is provided", () => {
			render(<Checkbox error="Invalid" label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			expect(checkbox).toHaveAttribute("aria-invalid", "true");
		});

		it("should not have aria-invalid when no error", () => {
			render(<Checkbox label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			expect(checkbox).toHaveAttribute("aria-invalid", "false");
		});

		it("should render as checked when checked prop is true", () => {
			render(<Checkbox checked onChange={() => {}} />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeChecked();
		});

		it("should render as unchecked by default", () => {
			render(<Checkbox />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).not.toBeChecked();
		});
	});

	describe("User Interactions", () => {
		it("should handle onChange event", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<Checkbox onChange={handleChange} />);
			const checkbox = screen.getByRole("checkbox");

			await user.click(checkbox);

			expect(handleChange).toHaveBeenCalled();
			expect(checkbox).toBeChecked();
		});

		it("should toggle checked state when clicked", async () => {
			const user = userEvent.setup();

			render(<Checkbox />);
			const checkbox = screen.getByRole("checkbox");

			expect(checkbox).not.toBeChecked();

			await user.click(checkbox);
			expect(checkbox).toBeChecked();

			await user.click(checkbox);
			expect(checkbox).not.toBeChecked();
		});

		it("should handle onBlur event", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();

			render(<Checkbox onBlur={handleBlur} />);
			const checkbox = screen.getByRole("checkbox");

			await user.click(checkbox);
			await user.tab();

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should handle onFocus event", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();

			render(<Checkbox onFocus={handleFocus} />);
			const checkbox = screen.getByRole("checkbox");

			await user.click(checkbox);

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});

		it("should toggle when label is clicked", async () => {
			const user = userEvent.setup();

			render(<Checkbox label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			const label = screen.getByText("Accept terms");

			expect(checkbox).not.toBeChecked();

			await user.click(label);
			expect(checkbox).toBeChecked();
		});

		it("should not toggle when disabled", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<Checkbox disabled onChange={handleChange} />);
			const checkbox = screen.getByRole("checkbox");

			await user.click(checkbox);

			expect(handleChange).not.toHaveBeenCalled();
			expect(checkbox).not.toBeChecked();
		});
	});

	describe("Accessibility", () => {
		it("should associate label with checkbox via htmlFor", () => {
			render(<Checkbox label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			expect(checkbox).toBeInTheDocument();
		});

		it("should have aria-describedby pointing to error when error exists", () => {
			render(<Checkbox error="Invalid" label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			const errorId = checkbox.getAttribute("aria-describedby");
			expect(errorId).toBeTruthy();
			expect(screen.getByText("Invalid")).toHaveAttribute("id", errorId);
		});

		it("should have aria-describedby pointing to helper text when provided", () => {
			render(<Checkbox helperText="This is required" label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			const helperId = checkbox.getAttribute("aria-describedby");
			expect(helperId).toBeTruthy();
			expect(screen.getByText("This is required")).toHaveAttribute("id", helperId);
		});

		it("should have role alert on error message", () => {
			render(<Checkbox error="Invalid" label="Accept terms" />);
			const errorMessage = screen.getByText("Invalid");
			expect(errorMessage).toHaveAttribute("role", "alert");
		});

		it("should not have role alert on helper text", () => {
			render(<Checkbox helperText="This is required" label="Accept terms" />);
			const helperText = screen.getByText("This is required");
			expect(helperText).not.toHaveAttribute("role", "alert");
		});

		it("should support aria-label when no label is provided", () => {
			render(<Checkbox aria-label="Accept terms and conditions" />);
			const checkbox = screen.getByLabelText("Accept terms and conditions");
			expect(checkbox).toBeInTheDocument();
		});
	});

	describe("Custom Props", () => {
		it("should accept and apply custom className", () => {
			render(<Checkbox className="custom-class" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox.className).toContain("custom-class");
		});

		it("should forward ref to checkbox element", () => {
			const ref = vi.fn();
			render(<Checkbox ref={ref} />);
			expect(ref).toHaveBeenCalled();
		});

		it("should accept custom id", () => {
			// biome-ignore lint/correctness/useUniqueElementIds: testing custom id assignment
			render(<Checkbox id="custom-id" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toHaveAttribute("id", "custom-id");
		});

		it("should generate id when id is not provided", () => {
			render(<Checkbox label="Accept terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			expect(checkbox).toHaveAttribute("id");
			expect(checkbox.getAttribute("id")).toBeTruthy();
		});

		it("should accept name attribute", () => {
			render(<Checkbox label="Accept terms" name="terms" />);
			const checkbox = screen.getByLabelText("Accept terms");
			expect(checkbox).toHaveAttribute("name", "terms");
		});

		it("should accept value attribute", () => {
			render(<Checkbox label="Option A" value="optionA" />);
			const checkbox = screen.getByLabelText("Option A");
			expect(checkbox).toHaveAttribute("value", "optionA");
		});
	});

	describe("Controlled Component", () => {
		it("should work as controlled component", async () => {
			const user = userEvent.setup();
			const TestComponent = () => {
				const [checked, setChecked] = React.useState(false);
				return <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
			};

			render(<TestComponent />);
			const checkbox = screen.getByRole("checkbox");

			expect(checkbox).not.toBeChecked();

			await user.click(checkbox);
			expect(checkbox).toBeChecked();

			await user.click(checkbox);
			expect(checkbox).not.toBeChecked();
		});

		it("should respect controlled checked value", () => {
			const { rerender } = render(<Checkbox checked={false} onChange={() => {}} />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).not.toBeChecked();

			rerender(<Checkbox checked onChange={() => {}} />);
			expect(checkbox).toBeChecked();
		});
	});

	describe("Uncontrolled Component", () => {
		it("should work as uncontrolled component with defaultChecked", () => {
			render(<Checkbox defaultChecked />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeChecked();
		});

		it("should toggle uncontrolled checkbox", async () => {
			const user = userEvent.setup();
			render(<Checkbox defaultChecked={false} />);
			const checkbox = screen.getByRole("checkbox");

			expect(checkbox).not.toBeChecked();

			await user.click(checkbox);
			expect(checkbox).toBeChecked();
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty label gracefully", () => {
			render(<Checkbox label="" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeInTheDocument();
		});

		it("should handle long error messages", () => {
			const longError =
				"This is a very long error message that should still render properly and be accessible to users";
			render(<Checkbox error={longError} label="Accept terms" />);
			expect(screen.getByText(longError)).toBeInTheDocument();
		});

		it("should handle special characters in label", () => {
			render(<Checkbox label="I accept the terms & conditions" />);
			expect(screen.getByLabelText("I accept the terms & conditions")).toBeInTheDocument();
		});

		it("should render without label", () => {
			render(<Checkbox aria-label="Hidden checkbox" />);
			const checkbox = screen.getByRole("checkbox");
			expect(checkbox).toBeInTheDocument();
		});

		it("should handle rapid clicks", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(<Checkbox onChange={handleChange} />);
			const checkbox = screen.getByRole("checkbox");

			await user.click(checkbox);
			await user.click(checkbox);
			await user.click(checkbox);

			expect(handleChange).toHaveBeenCalledTimes(3);
		});
	});
});
