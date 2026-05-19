"use client";

import { useCallback, useEffect, useRef } from "react";

export const useGridNavigation = (columns: number) => {
	const gridRef = useRef<HTMLElement>(null);

	const getFocusableElements = useCallback(() => {
		if (!gridRef.current) {
			return [];
		}

		return Array.from(gridRef.current.querySelectorAll('[data-navigation="grid-cell"]')) as HTMLElement[];
	}, []);

	const moveFocus = useCallback(
		(direction: "up" | "down" | "left" | "right") => {
			const elements = getFocusableElements();
			console.log("Elements: ", elements);
			if (elements.length === 0) return;

			const currentIndex = elements.indexOf(document.activeElement as HTMLElement);
			if (currentIndex === -1) return;

			let newIndex = currentIndex;

			switch (direction) {
				case "up":
					newIndex = Math.max(0, currentIndex - columns);
					break;
				case "down":
					newIndex = Math.min(elements.length - 1, currentIndex + columns);
					break;
				case "left":
					newIndex = Math.max(0, currentIndex - 1);
					break;
				case "right":
					newIndex = Math.min(elements.length - 1, currentIndex + 1);
					break;
			}

			if (newIndex !== currentIndex && elements[newIndex]) {
				elements[newIndex].focus();
			}
		},
		[columns, getFocusableElements]
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowUp":
					event.preventDefault();
					moveFocus("up");
					break;
				case "ArrowDown":
					event.preventDefault();
					moveFocus("down");
					break;
				case "ArrowLeft":
					event.preventDefault();
					moveFocus("left");
					break;
				case "ArrowRight":
					event.preventDefault();
					moveFocus("right");
					break;
			}
		},
		[moveFocus]
	);

	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.addEventListener("keydown", handleKeyDown);

		return () => {
			grid.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return { gridRef };
};
