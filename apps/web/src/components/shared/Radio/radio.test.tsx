import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from './radio';

describe('Radio', () => {
  describe('Basic Rendering', () => {
    it('should render radio element', () => {
      render(<Radio />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Radio label="Option 1" />);
      expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Radio helperText="Select this option" label="Option 1" />);
      expect(screen.getByText('Select this option')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Radio error="Selection required" label="Option 1" />);
      expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('should show error instead of helper text when both are provided', () => {
      render(
        <Radio error="Invalid" helperText="Helper text" label="Option 1" />
      );
      expect(screen.getByText('Invalid')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Required Field', () => {
    it('should render required indicator when required prop is true', () => {
      render(<Radio label="Option 1" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should not render required indicator when required is false', () => {
      render(<Radio label="Option 1" />);
      expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render with small size', () => {
      render(<Radio size="sm" />);
      const radio = screen.getByRole('radio');
      expect(radio.className).toContain('input--sm');
    });

    it('should render with medium size by default', () => {
      render(<Radio />);
      const radio = screen.getByRole('radio');
      expect(radio.className).toContain('input--md');
    });

    it('should render with large size', () => {
      render(<Radio size="lg" />);
      const radio = screen.getByRole('radio');
      expect(radio.className).toContain('input--lg');
    });
  });

  describe('States', () => {
    it('should render as disabled when disabled prop is true', () => {
      render(<Radio disabled />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeDisabled();
      expect(radio.className).toContain('input--disabled');
    });

    it('should have error styling when error is provided', () => {
      render(<Radio error="Error message" />);
      const radio = screen.getByRole('radio');
      expect(radio.className).toContain('input--error');
    });

    it('should have aria-invalid when error is provided', () => {
      render(<Radio error="Invalid" label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not have aria-invalid when no error', () => {
      render(<Radio label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('aria-invalid', 'false');
    });

    it('should render as checked when checked prop is true', () => {
      render(<Radio checked name="test" onChange={() => {}} />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeChecked();
    });

    it('should render as unchecked by default', () => {
      render(<Radio name="test" />);
      const radio = screen.getByRole('radio');
      expect(radio).not.toBeChecked();
    });
  });

  describe('User Interactions', () => {
    it('should handle onChange event', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radio name="test" onChange={handleChange} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);

      expect(handleChange).toHaveBeenCalled();
      expect(radio).toBeChecked();
    });

    it('should check when clicked', async () => {
      const user = userEvent.setup();

      render(<Radio name="test" />);
      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();

      await user.click(radio);
      expect(radio).toBeChecked();
    });

    it('should handle onBlur event', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();

      render(<Radio name="test" onBlur={handleBlur} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle onFocus event', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();

      render(<Radio name="test" onFocus={handleFocus} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should check when label is clicked', async () => {
      const user = userEvent.setup();

      render(<Radio label="Option 1" name="test" />);
      const radio = screen.getByLabelText('Option 1');
      const label = screen.getByText('Option 1');

      expect(radio).not.toBeChecked();

      await user.click(label);
      expect(radio).toBeChecked();
    });

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radio disabled name="test" onChange={handleChange} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);

      expect(handleChange).not.toHaveBeenCalled();
      expect(radio).not.toBeChecked();
    });
  });

  describe('Radio Group Behavior', () => {
    it('should handle radio group with same name', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Radio label="Option 1" name="group" />
          <Radio label="Option 2" name="group" />
          <Radio label="Option 3" name="group" />
        </div>
      );

      const radio1 = screen.getByLabelText('Option 1');
      const radio2 = screen.getByLabelText('Option 2');
      const radio3 = screen.getByLabelText('Option 3');

      await user.click(radio1);
      expect(radio1).toBeChecked();
      expect(radio2).not.toBeChecked();
      expect(radio3).not.toBeChecked();

      await user.click(radio2);
      expect(radio1).not.toBeChecked();
      expect(radio2).toBeChecked();
      expect(radio3).not.toBeChecked();
    });

    it('should allow different groups with different names', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Radio label="Group A - Option 1" name="groupA" />
          <Radio label="Group A - Option 2" name="groupA" />
          <Radio label="Group B - Option 1" name="groupB" />
          <Radio label="Group B - Option 2" name="groupB" />
        </div>
      );

      const groupARadio1 = screen.getByLabelText('Group A - Option 1');
      const groupARadio2 = screen.getByLabelText('Group A - Option 2');
      const groupBRadio1 = screen.getByLabelText('Group B - Option 1');
      const groupBRadio2 = screen.getByLabelText('Group B - Option 2');

      await user.click(groupARadio1);
      await user.click(groupBRadio1);

      expect(groupARadio1).toBeChecked();
      expect(groupARadio2).not.toBeChecked();
      expect(groupBRadio1).toBeChecked();
      expect(groupBRadio2).not.toBeChecked();
    });
  });

  describe('Accessibility', () => {
    it('should associate label with radio via htmlFor', () => {
      render(<Radio label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toBeInTheDocument();
    });

    it('should have aria-describedby pointing to error when error exists', () => {
      render(<Radio error="Invalid" label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      const errorId = radio.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Invalid')).toHaveAttribute('id', errorId);
    });

    it('should have aria-describedby pointing to helper text when provided', () => {
      render(<Radio helperText="Select this option" label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      const helperId = radio.getAttribute('aria-describedby');
      expect(helperId).toBeTruthy();
      expect(screen.getByText('Select this option')).toHaveAttribute(
        'id',
        helperId
      );
    });

    it('should have role alert on error message', () => {
      render(<Radio error="Invalid" label="Option 1" />);
      const errorMessage = screen.getByText('Invalid');
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('should not have role alert on helper text', () => {
      render(<Radio helperText="Select this option" label="Option 1" />);
      const helperText = screen.getByText('Select this option');
      expect(helperText).not.toHaveAttribute('role', 'alert');
    });

    it('should support aria-label when no label is provided', () => {
      render(<Radio aria-label="Select option one" />);
      const radio = screen.getByLabelText('Select option one');
      expect(radio).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<Radio className="custom-class" />);
      const radio = screen.getByRole('radio');
      expect(radio.className).toContain('custom-class');
    });

    it('should forward ref to radio element', () => {
      const ref = vi.fn();
      render(<Radio ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('should accept custom id', () => {
      // biome-ignore lint/correctness/useUniqueElementIds: testing custom id assignment
      render(<Radio id="custom-id" />);
      const radio = screen.getByRole('radio');
      expect(radio).toHaveAttribute('id', 'custom-id');
    });

    it('should generate id when id is not provided', () => {
      render(<Radio label="Option 1" />);
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('id');
      expect(radio.getAttribute('id')).toBeTruthy();
    });

    it('should accept name attribute', () => {
      render(<Radio label="Option 1" name="options" />);
      const radio = screen.getByLabelText('Option 1');
      expect(radio).toHaveAttribute('name', 'options');
    });

    it('should accept value attribute', () => {
      render(<Radio label="Option A" value="optionA" />);
      const radio = screen.getByLabelText('Option A');
      expect(radio).toHaveAttribute('value', 'optionA');
    });
  });

  describe('Controlled Component', () => {
    it('should work as controlled component', async () => {
      const user = userEvent.setup();
      const TestComponent = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Radio
            checked={checked}
            name="test"
            onChange={(e) => setChecked(e.target.checked)}
          />
        );
      };

      render(<TestComponent />);
      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();

      await user.click(radio);
      expect(radio).toBeChecked();
    });

    it('should respect controlled checked value', () => {
      const { rerender } = render(
        <Radio checked={false} name="test" onChange={() => {}} />
      );
      const radio = screen.getByRole('radio');
      expect(radio).not.toBeChecked();

      rerender(<Radio checked name="test" onChange={() => {}} />);
      expect(radio).toBeChecked();
    });
  });

  describe('Uncontrolled Component', () => {
    it('should work as uncontrolled component with defaultChecked', () => {
      render(<Radio defaultChecked name="test" />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeChecked();
    });

    it('should check uncontrolled radio', async () => {
      const user = userEvent.setup();
      render(<Radio defaultChecked={false} name="test" />);
      const radio = screen.getByRole('radio');

      expect(radio).not.toBeChecked();

      await user.click(radio);
      expect(radio).toBeChecked();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label gracefully', () => {
      render(<Radio label="" />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
    });

    it('should handle long error messages', () => {
      const longError =
        'This is a very long error message that should still render properly and be accessible to users';
      render(<Radio error={longError} label="Option 1" />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it('should handle special characters in label', () => {
      render(<Radio label="I choose option #1" />);
      expect(screen.getByLabelText('I choose option #1')).toBeInTheDocument();
    });

    it('should render without label', () => {
      render(<Radio aria-label="Hidden radio" />);
      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
    });

    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Radio name="test" onChange={handleChange} />);
      const radio = screen.getByRole('radio');

      await user.click(radio);
      await user.click(radio);
      await user.click(radio);

      // Radio buttons don't toggle once checked, so only first click triggers change
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });
});
