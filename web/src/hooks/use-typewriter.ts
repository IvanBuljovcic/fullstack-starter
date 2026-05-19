"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TypingStatus = "idle" | "typing" | "paused" | "completed";

const DEFAULT_DELAY_CHARACTERS = [".", ",", "!", "?"];

export type UseTypewriterOptions = {
	text: string;
	speed?: number;
	punctuationDelayMultiplier?: number;
	autoStart?: boolean;
	delayCharacters?: string[];
};

export type UseTypewriterReturn = {
	displayText: string;
	status: TypingStatus;
	isComplete: boolean;
	isTyping: boolean;
	isPaused: boolean;
	start: () => void;
	pause: () => void;
	resume: () => void;
	reset: () => void;
};

export const useTypewriter = ({
	text,
	speed = 50,
	punctuationDelayMultiplier = 2,
	autoStart = true,
	delayCharacters,
}: UseTypewriterOptions): UseTypewriterReturn => {
	const [displayText, setDisplayText] = useState("");
	const [status, setStatus] = useState<TypingStatus>("idle");

	const indexRef = useRef(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const statusRef = useRef<TypingStatus>("idle");
	const textRef = useRef(text);

	const stableDelayChars = useMemo(() => delayCharacters || DEFAULT_DELAY_CHARACTERS, [delayCharacters]);

	const updateStatus = useCallback((newStatus: TypingStatus) => {
		statusRef.current = newStatus;
		setStatus(newStatus);
	}, []);

	const typeChar = useCallback(() => {
		const currentIndex = indexRef.current;
		const currentText = textRef.current;

		if (currentIndex >= currentText.length) {
			updateStatus("completed");
			return;
		}

		setDisplayText(currentText.substring(0, currentIndex + 1));

		const char = currentText[currentIndex];
		const shouldDelay = stableDelayChars.includes(char);
		const delay = shouldDelay ? speed * punctuationDelayMultiplier : speed;

		indexRef.current++;

		if (statusRef.current === "paused") {
			return;
		}

		timeoutRef.current = setTimeout(typeChar, delay);
	}, [speed, punctuationDelayMultiplier, updateStatus, stableDelayChars]);

	const startTyping = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		indexRef.current = 0;
		textRef.current = text;
		setDisplayText("");
		updateStatus("typing");
		typeChar();
	}, [text, typeChar, updateStatus]);

	const pauseTyping = useCallback(() => {
		if (statusRef.current !== "typing") {
			return;
		}

		updateStatus("paused");

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, [updateStatus]);

	const resumeTyping = useCallback(() => {
		if (statusRef.current !== "paused") {
			return;
		}

		updateStatus("typing");
		typeChar();
	}, [typeChar, updateStatus]);

	const reset = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		indexRef.current = 0;
		setDisplayText("");
		updateStatus("idle");
	}, [updateStatus]);

	useEffect(() => {
		if (autoStart) {
			startTyping();
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [autoStart, startTyping]);

	return {
		displayText,
		status,
		isComplete: status === "completed",
		isTyping: status === "typing",
		isPaused: status === "paused",
		start: startTyping,
		pause: pauseTyping,
		resume: resumeTyping,
		reset,
	};
};
