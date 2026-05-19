"use client";

import { useCallback, useEffect, useRef } from "react";

type KeyboardNavigationOptions = {
	onEnter?: () => void;
	onEscape?: () => void;
	onArrowUp?: () => void;
	onArrowDown?: () => void;
	onArrowLeft?: () => void;
	onArrowRight?: () => void;
	onTab?: () => void;
	onShiftTab?: () => void;
	trapFocus?: boolean;
	restoreFocus?: boolean;
};

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
	const {
		onEnter,
		onEscape,
		onArrowUp,
		onArrowDown,
		onArrowLeft,
		onArrowRight,
		onTab,
		onShiftTab,
		trapFocus = false,
		restoreFocus = false,
	} = options;

	const containerRef = useRef<HTMLElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			switch (event.key) {
				case "Enter":
					if (onEnter && !event.defaultPrevented) {
						event.preventDefault();
						onEnter();
					}
					break;
				case "Escape":
					if (onEscape) {
						event.preventDefault();
						onEscape();
					}
					break;
				case "ArrowUp":
					if (onArrowUp) {
						event.preventDefault();
						onArrowUp();
					}
					break;
				case "ArrowDown":
					if (onArrowDown) {
						event.preventDefault();
						onArrowDown();
					}
					break;
				case "ArrowLeft":
					if (onArrowLeft) {
						event.preventDefault();
						onArrowLeft();
					}
					break;
				case "ArrowRight":
					if (onArrowRight) {
						event.preventDefault();
						onArrowRight();
					}
					break;
				case "Tab":
					if (event.shiftKey && onShiftTab) {
						onShiftTab();
					} else if (onTab) {
						onTab();
					}

					// Focus trapping
					if (trapFocus && containerRef.current) {
						const focusableElements = containerRef.current.querySelectorAll(
							'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
						);
						const firstElement = focusableElements[0] as HTMLElement;
						const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

						if (event.shiftKey && document.activeElement === firstElement) {
							event.preventDefault();
							lastElement?.focus();
						} else if (!event.shiftKey && document.activeElement === lastElement) {
							event.preventDefault();
							firstElement?.focus();
						}
					}
					break;
			}
		},
		[onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onShiftTab, trapFocus]
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Store previous focus for restoration
		if (restoreFocus) {
			previousFocusRef.current = document.activeElement as HTMLElement;
		}

		container.addEventListener("keydown", handleKeyDown);

		return () => {
			container.removeEventListener("keydown", handleKeyDown);

			// Restore previous focus
			if (restoreFocus && previousFocusRef.current) {
				previousFocusRef.current.focus();
			}
		};
	}, [handleKeyDown, restoreFocus]);

	return { containerRef };
};
