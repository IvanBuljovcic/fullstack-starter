import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef, useId } from "react";
import styles from "./select.module.css";

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size"> {
	label?: string;
	error?: string;
	helperText?: string;
	size?: "sm" | "md" | "lg";
	fullWidth?: boolean;
	placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	(
		{
			label,
			error,
			helperText,
			size = "md",
			fullWidth = false,
			className,
			id,
			disabled: isDisabled,
			placeholder,
			children,
			...props
		},
		ref
	) => {
		const dropdownArrowId = useId();
		const generatedId = useId();
		const selectId = id || generatedId;
		const hasError = Boolean(error);

		const selectClassName = clsx(
			styles.select,
			styles[`select--${size}`],
			hasError && styles["select--error"],
			isDisabled && styles["select--disabled"],
			fullWidth && styles["select--fullWidth"],
			className
		);

		return (
			<div className={clsx(styles.selectWrapper, fullWidth && styles["selectWrapper--fullWidth"])}>
				{label && (
					<label className={styles.label} htmlFor={selectId}>
						{label}
						{props.required && <span className={styles.required}>*</span>}
					</label>
				)}
				<div className={styles.selectContainer}>
					<select
						aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
						aria-invalid={hasError}
						className={selectClassName}
						disabled={isDisabled}
						id={selectId}
						ref={ref}
						{...props}
					>
						{placeholder && (
							<option disabled value="">
								{placeholder}
							</option>
						)}
						{children}
					</select>
					<div aria-hidden="true" className={styles.icon}>
						<svg
							aria-labelledby={dropdownArrowId}
							fill="none"
							height="20"
							viewBox="0 0 20 20"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title id={dropdownArrowId}>Select dropdown arrow</title>
							<path
								d="M5 7.5L10 12.5L15 7.5"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
							/>
						</svg>
					</div>
				</div>
				{error && (
					<p className={styles.errorText} id={`${selectId}-error`} role="alert">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p className={styles.helperText} id={`${selectId}-helper`}>
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

Select.displayName = "Select";
