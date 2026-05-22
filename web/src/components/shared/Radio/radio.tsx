import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { SelectionInput } from '../SelectionInput/selectionInput';

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  return <SelectionInput {...props} ref={ref} variant="radio" />;
});

Radio.displayName = 'Radio';
