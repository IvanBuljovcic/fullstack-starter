import type { AnnouncementPriority } from "@/providers/AnnouncementProvider";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastOptions = {
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
	announceToScreenReader?: boolean;
	announcementPriority?: AnnouncementPriority;
};

export type Toast = {
	id: string;
	variant: ToastVariant;
	title: string;
} & ToastOptions;

class ToastManager {
	private listeners = new Set<(toasts: Toast[]) => void>();
	private visibleToasts: Toast[] = [];
	private queuedToasts: Toast[] = [];
	private maxToasts = 5;
	private timers = new Map<string, NodeJS.Timeout>();
	private remainingTime = new Map<string, number>();
	private startTime = new Map<string, number>();
	private announceCallback?: (message: string, priority: AnnouncementPriority) => void;

	setMaxToasts(max: number) {
		this.maxToasts = max;
		this.processQueue();
	}

	setAnnouncer(callback: (message: string, priority: AnnouncementPriority) => void) {
		this.announceCallback = callback;
	}

	subscribe(listener: (toasts: Toast[]) => void) {
		this.listeners.add(listener);
		listener(this.visibleToasts);
		return () => {
			this.listeners.delete(listener);
		};
	}

	addToast(toast: Omit<Toast, "id">) {
		const id = crypto.randomUUID();
		const newToast: Toast = {
			id,
			duration: 5000,
			announceToScreenReader: true,
			...toast,
		};

		// Check if we're at capacity
		if (this.visibleToasts.length >= this.maxToasts) {
			// Add to queue based on priority
			if (newToast.variant === "error") {
				this.queuedToasts.unshift(newToast); // Errors go to front
			} else {
				this.queuedToasts.push(newToast); // Others go to back
			}

			// Still announce queued toasts to screen readers
			this.announceToast(newToast);
		} else {
			this.showToast(newToast);
		}

		return id;
	}

	private showToast(toast: Toast) {
		this.visibleToasts = [...this.visibleToasts, toast];

		// Announce to screen readers
		this.announceToast(toast);

		this.notify();

		// Set up auto-dismiss
		if (toast.duration && toast.duration > 0) {
			this.startTime.set(toast.id, Date.now());
			this.remainingTime.set(toast.id, toast.duration);
			const timer = setTimeout(() => {
				this.dismissToast(toast.id);
			}, toast.duration);
			this.timers.set(toast.id, timer);
		}
	}

	private announceToast(toast: Toast) {
		if (toast.announceToScreenReader && this.announceCallback) {
			const priority = toast.announcementPriority || (toast.variant === "error" ? "assertive" : "polite");
			const message = toast.description ? `${toast.title}. ${toast.description}` : toast.title;
			this.announceCallback(message, priority);
		}
	}

	dismissToast(id: string) {
		// Clear timer
		const timer = this.timers.get(id);
		if (timer) {
			clearTimeout(timer);
			this.timers.delete(id);
		}

		// Clean up timing data
		this.remainingTime.delete(id);
		this.startTime.delete(id);

		// Remove from visible toasts
		this.visibleToasts = this.visibleToasts.filter((t) => t.id !== id);

		// Also remove from queue if it's there
		this.queuedToasts = this.queuedToasts.filter((t) => t.id !== id);

		this.notify();

		// Process queue to show next toast
		this.processQueue();
	}

	pauseToast(id: string) {
		// Check if toast has an active timer
		const timer = this.timers.get(id);
		if (!timer) {
			return; // No active timer, nothing to pause
		}

		// Calculate remaining time
		const start = this.startTime.get(id);
		const remaining = this.remainingTime.get(id);
		if (start !== undefined && remaining !== undefined) {
			const elapsed = Date.now() - start;
			const newRemaining = Math.max(0, remaining - elapsed);
			this.remainingTime.set(id, newRemaining);
		}

		// Clear the timer
		clearTimeout(timer);
		this.timers.delete(id);
	}

	resumeToast(id: string) {
		// Check if toast is already running
		if (this.timers.has(id)) {
			return; // Already running, nothing to resume
		}

		// Get remaining time
		const remaining = this.remainingTime.get(id);
		if (remaining === undefined || remaining <= 0) {
			return; // No remaining time or invalid state
		}

		// Restart timer with remaining time
		this.startTime.set(id, Date.now());
		const timer = setTimeout(() => {
			this.dismissToast(id);
		}, remaining);
		this.timers.set(id, timer);
	}

	private processQueue() {
		// Show queued toasts if there's space
		while (this.visibleToasts.length < this.maxToasts && this.queuedToasts.length > 0) {
			const nextToast = this.queuedToasts.shift();
			if (nextToast) {
				this.showToast(nextToast);
			}
		}
	}

	dismissAll() {
		// Clear all timers
		this.timers.forEach((timer) => {
			clearTimeout(timer);
		});
		this.timers.clear();

		// Clear timing data
		this.remainingTime.clear();
		this.startTime.clear();

		// Clear toasts
		this.visibleToasts = [];
		this.queuedToasts = [];

		this.notify();
	}

	getStats() {
		return {
			visible: this.visibleToasts.length,
			queued: this.queuedToasts.length,
			maxToasts: this.maxToasts,
		};
	}

	private notify() {
		this.listeners.forEach((listener) => {
			listener(this.visibleToasts);
		});
	}
}

const toastManager = new ToastManager();

export const toast = {
	success: (title: string, options?: Partial<ToastOptions>) =>
		toastManager.addToast({ variant: "success", title, ...options }),

	error: (title: string, options?: Partial<ToastOptions>) =>
		toastManager.addToast({ variant: "error", title, ...options }),

	warning: (title: string, options?: Partial<ToastOptions>) =>
		toastManager.addToast({ variant: "warning", title, ...options }),

	info: (title: string, options?: Partial<ToastOptions>) =>
		toastManager.addToast({ variant: "info", title, ...options }),

	dismiss: (id: string) => toastManager.dismissToast(id),

	dismissAll: () => toastManager.dismissAll(),

	pause: (id: string) => toastManager.pauseToast(id),

	resume: (id: string) => toastManager.resumeToast(id),

	config: {
		setMaxToasts: (max: number) => toastManager.setMaxToasts(max),
	},
};

export { toastManager };
