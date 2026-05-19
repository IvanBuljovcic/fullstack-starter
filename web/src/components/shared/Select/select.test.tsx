import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./select";

describe("Select", () => {
	describe("Basic Rendering", () => {
		it("should render select element", () => {
			render(
				<Select>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select).toBeInTheDocument();
		});

		it("should render with label", () => {
			render(
				<Select label="Country">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByLabelText("Country")).toBeInTheDocument();
		});

		it("should render with placeholder", () => {
			render(
				<Select placeholder="Select an option">
					<option value="1">Option 1</option>
				</Select>
			);
			expect(screen.getByText("Select an option")).toBeInTheDocument();
		});

		it("should render placeholder as disabled option", () => {
			render(
				<Select placeholder="Select an option">
					<option value="1">Option 1</option>
				</Select>
			);
			const placeholderOption = screen.getByText("Select an option") as HTMLOptionElement;
			expect(placeholderOption.disabled).toBe(true);
			expect(placeholderOption.value).toBe("");
		});

		it("should render with helper text", () => {
			render(
				<Select helperText="Choose your country" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByText("Choose your country")).toBeInTheDocument();
		});

		it("should render with error message", () => {
			render(
				<Select error="Country is required" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByText("Country is required")).toBeInTheDocument();
		});

		it("should show error instead of helper text when both are provided", () => {
			render(
				<Select error="Invalid selection" helperText="Choose your country" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByText("Invalid selection")).toBeInTheDocument();
			expect(screen.queryByText("Choose your country")).not.toBeInTheDocument();
		});

		it("should render options", () => {
			render(
				<Select label="Fruit">
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
					<option value="orange">Orange</option>
				</Select>
			);
			expect(screen.getByText("Apple")).toBeInTheDocument();
			expect(screen.getByText("Banana")).toBeInTheDocument();
			expect(screen.getByText("Orange")).toBeInTheDocument();
		});
	});

	describe("Required Field", () => {
		it("should render required indicator when required prop is true", () => {
			render(
				<Select label="Country" required>
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("should not render required indicator when required is false", () => {
			render(
				<Select label="Country">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});
	});

	describe("Size Variants", () => {
		it("should render with small size", () => {
			render(
				<Select size="sm">
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).toContain("select--sm");
		});

		it("should render with medium size by default", () => {
			render(
				<Select>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).toContain("select--md");
		});

		it("should render with large size", () => {
			render(
				<Select size="lg">
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).toContain("select--lg");
		});
	});

	describe("Full Width", () => {
		it("should apply full width class when fullWidth is true", () => {
			render(
				<Select fullWidth>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).toContain("select--fullWidth");
		});

		it("should not apply full width class by default", () => {
			render(
				<Select>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).not.toContain("select--fullWidth");
		});
	});

	describe("States", () => {
		it("should render as disabled when disabled prop is true", () => {
			render(
				<Select disabled>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select).toBeDisabled();
			expect(select.className).toContain("select--disabled");
		});

		it("should have error styling when error is provided", () => {
			render(
				<Select error="Error message">
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).toContain("select--error");
		});

		it("should have aria-invalid when error is provided", () => {
			render(
				<Select error="Invalid selection" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const select = screen.getByLabelText("Country");
			expect(select).toHaveAttribute("aria-invalid", "true");
		});

		it("should not have aria-invalid when no error", () => {
			render(
				<Select label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const select = screen.getByLabelText("Country");
			expect(select).toHaveAttribute("aria-invalid", "false");
		});
	});

	describe("User Interactions", () => {
		it("should handle onChange event", async () => {
			const user = userEvent.setup();
			const handleChange = vi.fn();

			render(
				<Select onChange={handleChange}>
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
				</Select>
			);
			const select = screen.getByRole("combobox");

			await user.selectOptions(select, "banana");

			expect(handleChange).toHaveBeenCalled();
			expect(select).toHaveValue("banana");
		});

		it("should handle onBlur event", async () => {
			const user = userEvent.setup();
			const handleBlur = vi.fn();

			render(
				<Select onBlur={handleBlur}>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");

			await user.click(select);
			await user.tab();

			expect(handleBlur).toHaveBeenCalledTimes(1);
		});

		it("should handle onFocus event", async () => {
			const user = userEvent.setup();
			const handleFocus = vi.fn();

			render(
				<Select onFocus={handleFocus}>
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");

			await user.click(select);

			expect(handleFocus).toHaveBeenCalledTimes(1);
		});
	});

	describe("Accessibility", () => {
		it("should associate label with select via htmlFor", () => {
			render(
				<Select label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const select = screen.getByLabelText("Country");
			expect(select).toBeInTheDocument();
		});

		it("should have aria-describedby pointing to error when error exists", () => {
			render(
				<Select error="Invalid selection" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const select = screen.getByLabelText("Country");
			const errorId = select.getAttribute("aria-describedby");
			expect(errorId).toBeTruthy();
			expect(screen.getByText("Invalid selection")).toHaveAttribute("id", errorId);
		});

		it("should have aria-describedby pointing to helper text when provided", () => {
			render(
				<Select helperText="Choose your country" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const select = screen.getByLabelText("Country");
			const helperId = select.getAttribute("aria-describedby");
			expect(helperId).toBeTruthy();
			expect(screen.getByText("Choose your country")).toHaveAttribute("id", helperId);
		});

		it("should have role alert on error message", () => {
			render(
				<Select error="Invalid selection" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const errorMessage = screen.getByText("Invalid selection");
			expect(errorMessage).toHaveAttribute("role", "alert");
		});

		it("should not have role alert on helper text", () => {
			render(
				<Select helperText="Choose your country" label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const helperText = screen.getByText("Choose your country");
			expect(helperText).not.toHaveAttribute("role", "alert");
		});
	});

	describe("Custom Props", () => {
		it("should accept and apply custom className", () => {
			render(
				<Select className="custom-class">
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select.className).toContain("custom-class");
		});

		it("should forward ref to select element", () => {
			const ref = vi.fn();
			render(
				<Select ref={ref}>
					<option value="1">Option 1</option>
				</Select>
			);
			expect(ref).toHaveBeenCalled();
		});

		it("should accept custom id", () => {
			render(
				// biome-ignore lint/correctness/useUniqueElementIds: false positive
				<Select id="custom-id">
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select).toHaveAttribute("id", "custom-id");
		});

		it("should generate id when id is not provided", () => {
			render(
				<Select label="Country">
					<option value="us">USA</option>
				</Select>
			);
			const select = screen.getByLabelText("Country");
			expect(select).toHaveAttribute("id");
			expect(select.getAttribute("id")).toBeTruthy();
		});
	});

	describe("Value Handling", () => {
		it("should render with initial value", () => {
			render(
				<Select onChange={() => {}} value="banana">
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select).toHaveValue("banana");
		});

		it("should work as controlled component", async () => {
			const user = userEvent.setup();
			const TestComponent = () => {
				const [value, setValue] = React.useState("");
				return (
					<Select onChange={(e) => setValue(e.target.value)} value={value}>
						<option value="apple">Apple</option>
						<option value="banana">Banana</option>
					</Select>
				);
			};

			render(<TestComponent />);
			const select = screen.getByRole("combobox");

			await user.selectOptions(select, "banana");
			expect(select).toHaveValue("banana");
		});

		it("should work as uncontrolled component", async () => {
			const user = userEvent.setup();
			render(
				<Select defaultValue="apple">
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
				</Select>
			);
			const select = screen.getByRole("combobox");

			expect(select).toHaveValue("apple");

			await user.selectOptions(select, "banana");
			expect(select).toHaveValue("banana");
		});
	});

	describe("Optgroups", () => {
		it("should render optgroups correctly", () => {
			render(
				<Select label="City">
					<optgroup label="North America">
						<option value="nyc">New York</option>
						<option value="la">Los Angeles</option>
					</optgroup>
					<optgroup label="Europe">
						<option value="london">London</option>
						<option value="paris">Paris</option>
					</optgroup>
				</Select>
			);

			expect(screen.getByText("New York")).toBeInTheDocument();
			expect(screen.getByText("London")).toBeInTheDocument();
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty label gracefully", () => {
			render(
				<Select label="">
					<option value="1">Option 1</option>
				</Select>
			);
			const select = screen.getByRole("combobox");
			expect(select).toBeInTheDocument();
		});

		it("should handle long error messages", () => {
			const longError =
				"This is a very long error message that should still render properly and be accessible to users";
			render(
				<Select error={longError} label="Country">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByText(longError)).toBeInTheDocument();
		});

		it("should handle special characters in label", () => {
			render(
				<Select label="Country (required)">
					<option value="us">USA</option>
				</Select>
			);
			expect(screen.getByLabelText("Country (required)")).toBeInTheDocument();
		});

		it("should handle no children gracefully", () => {
			render(<Select label="Empty" />);
			const select = screen.getByRole("combobox");
			expect(select).toBeInTheDocument();
		});
	});

	describe("Multiple Attribute", () => {
		it("should support multiple attribute", () => {
			render(
				<Select label="Fruits" multiple>
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
				</Select>
			);
			const select = screen.getByLabelText("Fruits");
			expect(select).toHaveAttribute("multiple");
		});
	});
});
