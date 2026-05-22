import { useCallback, useRef } from "react";

export const useThrottle = <T extends (...args: Parameters<T>) => void>(callback: T, limit: number) => {
	const lastCall = useRef<number>(0);

	return useCallback(
		(...args: Parameters<T>) => {
			const now = Date.now();

			if (now - lastCall.current >= limit) {
				lastCall.current = now;
				callback(...args);
			}
		},
		[callback, limit]
	);
};
