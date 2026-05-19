"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useAnnouncement } from "@/providers/AnnouncementProvider";
import { ToastContainer, type ToastPosition } from "./toast-container";
import type { Toast } from "./toast-manager";
import { toast, toastManager } from "./toast-manager";

interface ToastProviderProps {
	children: ReactNode;
	maxToasts?: number;
	position?: ToastPosition;
}

export const ToastProvider = ({ children, maxToasts = 5, position = "top-right" }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<Toast[]>([]);
	const { announce } = useAnnouncement();

	useEffect(() => {
		// Configure max toasts
		toastManager.setMaxToasts(maxToasts);

		// Register announcer callback
		toastManager.setAnnouncer(announce);

		// Subscribe to toast updates
		const unsubscribe = toastManager.subscribe(setToasts);

		return unsubscribe;
	}, [announce, maxToasts]);

	return (
		<>
			{children}
			<ToastContainer
				onDismiss={toast.dismiss}
				onPause={toast.pause}
				onResume={toast.resume}
				position={position}
				toasts={toasts}
			/>
		</>
	);
};
