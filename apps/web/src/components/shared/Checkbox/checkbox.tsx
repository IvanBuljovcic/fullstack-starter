import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { SelectionInput } from '../SelectionInput/selectionInput';

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    return <SelectionInput {...props} ref={ref} variant="checkbox" />;
  }
);

Checkbox.displayName = 'Checkbox';
