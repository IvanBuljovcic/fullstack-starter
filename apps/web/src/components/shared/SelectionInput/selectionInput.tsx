import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useId } from 'react';
import styles from './selectionInput.module.css';

type BaseSelectionInputProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'size'
> & {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
};

interface CheckboxVariantProps extends BaseSelectionInputProps {
  variant: 'checkbox';
}

interface RadioVariantProps extends BaseSelectionInputProps {
  variant: 'radio';
}

export type SelectionInputProps = CheckboxVariantProps | RadioVariantProps;

export const SelectionInput = forwardRef<HTMLInputElement, SelectionInputProps>(
  (
    {
      variant,
      label,
      error,
      helperText,
      size = 'md',
      className,
      id,
      disabled: isDisabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = Boolean(error);

    const inputClassName = clsx(
      styles.input,
      styles[`input--${variant}`],
      styles[`input--${size}`],
      hasError && styles['input--error'],
      isDisabled && styles['input--disabled'],
      className
    );

    const ariaDescribedBy = () => {
      if (error) {
        return `${inputId}-error`;
      }

      if (helperText) {
        return `${inputId}-helper`;
      }

      return undefined;
    };

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <input
            aria-describedby={ariaDescribedBy()}
            aria-invalid={hasError}
            className={inputClassName}
            disabled={isDisabled}
            id={inputId}
            ref={ref}
            type={variant}
            {...props}
          />
          {label && (
            <label className={styles.label} htmlFor={inputId}>
              {label}
              {props.required && <span className={styles.required}>*</span>}
            </label>
          )}
        </div>
        {error && (
          <p className={styles.errorText} id={`${inputId}-error`} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className={styles.helperText} id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SelectionInput.displayName = 'SelectionInput';
