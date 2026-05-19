import clsx from "clsx";
import { Toast } from "./toast";
import styles from "./toast-container.module.css";
import type { Toast as ToastType } from "./toast-manager";

export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

interface ToastContainerProps {
	toasts: ToastType[];
	onDismiss: (id: string) => void;
	onPause: (id: string) => void;
	onResume: (id: string) => void;
	position?: ToastPosition;
}

export const ToastContainer = ({
	toasts,
	onDismiss,
	onPause,
	onResume,
	position = "top-right",
}: ToastContainerProps) => {
	if (toasts.length === 0) {
		return null;
	}

	return (
		<div aria-atomic="false" aria-live="polite" className={clsx(styles.container, styles[`container--${position}`])}>
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} onDismiss={() => onDismiss(toast.id)} onPause={onPause} onResume={onResume} />
			))}
		</div>
	);
};
