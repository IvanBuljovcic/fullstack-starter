import clsx from "clsx";
import styles from "./toast.module.css";
import type { Toast as ToastType } from "./toast-manager";

interface ToastProps extends ToastType {
	onDismiss: () => void;
	onPause: (id: string) => void;
	onResume: (id: string) => void;
}

const getIcon = (variant: ToastType["variant"]) => {
	switch (variant) {
		case "success":
			return (
				<svg
					aria-hidden="true"
					fill="none"
					height="20"
					viewBox="0 0 20 20"
					width="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
						fill="currentColor"
					/>
				</svg>
			);
		case "error":
			return (
				<svg
					aria-hidden="true"
					fill="none"
					height="20"
					viewBox="0 0 20 20"
					width="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
						fill="currentColor"
					/>
				</svg>
			);
		case "warning":
			return (
				<svg
					aria-hidden="true"
					fill="none"
					height="20"
					viewBox="0 0 20 20"
					width="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M1 17H19L10 1L1 17ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z" fill="currentColor" />
				</svg>
			);
		case "info":
			return (
				<svg
					aria-hidden="true"
					fill="none"
					height="20"
					viewBox="0 0 20 20"
					width="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
						fill="currentColor"
					/>
				</svg>
			);
	}
};

export const Toast = ({ id, variant, title, description, action, onDismiss, onPause, onResume }: ToastProps) => {
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: toast has correct ARIA roles. Hover actions are supplementary for UX, not required functionality
		<div
			aria-atomic="true"
			className={clsx(styles.toast, styles[`toast--${variant}`])}
			onMouseEnter={() => onPause(id)}
			onMouseLeave={() => onResume(id)}
			role={variant === "error" ? "alert" : "status"}
		>
			<div className={styles.iconWrapper}>{getIcon(variant)}</div>

			<div className={styles.content}>
				<p className={styles.title}>{title}</p>
				{description && <p className={styles.description}>{description}</p>}
			</div>

			<div className={styles.actions}>
				{action && (
					<button className={styles.actionButton} onClick={action.onClick} type="button">
						{action.label}
					</button>
				)}
				<button aria-label="Dismiss notification" className={styles.dismissButton} onClick={onDismiss} type="button">
					<svg
						aria-hidden="true"
						fill="none"
						height="16"
						viewBox="0 0 16 16"
						width="16"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.5 3.5L8 8L3.5 3.5L2 5L6.5 9.5L2 14L3.5 15.5L8 11L12.5 15.5L14 14L9.5 9.5L14 5L12.5 3.5Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};
