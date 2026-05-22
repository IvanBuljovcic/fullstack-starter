import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef, useId } from "react";
import styles from "./input.module.css";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
	label?: string;
	error?: string;
	helperText?: string;
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{ label, error, helperText, size = "md", fullWidth = false, className, id, disabled: isDisabled, ...props },
		ref
	) => {
		const generatedId = useId();
		const inputId = id || generatedId;
		const hasError = Boolean(error);

		const inputClassName = clsx(
			styles.input,
			styles[`input--${size}`],
			hasError && styles["input--error"],
			isDisabled && styles["input--disabled"],
			fullWidth && styles["input--fullWidth"],
			className
		);

		return (
			<div className={clsx(styles.inputWrapper, fullWidth && styles["inputWrapper--fullWidth"])}>
				{label && (
					<label className={styles.label} htmlFor={inputId}>
						{label}
						{props.required && <span className={styles.required}>*</span>}
					</label>
				)}
				<input
					aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
					aria-invalid={hasError}
					className={inputClassName}
					disabled={isDisabled}
					id={inputId}
					ref={ref}
					{...props}
				/>
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

Input.displayName = "Input";
