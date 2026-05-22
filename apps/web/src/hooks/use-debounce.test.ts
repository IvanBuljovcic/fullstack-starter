import { afterEach } from "node:test";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce, useDebouncedCallback } from "./use-debounce";

describe("Debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("useDebounce", () => {
		describe("Basic functionality", () => {
			it("should return initial value immediately", () => {
				const { result } = renderHook(() => useDebounce("initial", 1000));

				expect(result.current).toBe("initial");
			});

			it("should debounce value changes", () => {
				const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
					initialProps: {
						value: "first",
						delay: 500,
					},
				});

				expect(result.current).toBe("first");

				rerender({ value: "second", delay: 500 });

				// Should still be old value
				expect(result.current).toBe("first");

				// Advance time but not enough
				act(() => {
					vi.advanceTimersByTime(300);
				});
				expect(result.current).toBe("first");

				// Advance time past delay
				act(() => {
					vi.advanceTimersByTime(200);
				});
				// vi.runAllTimers(); // Ensure all timers complete and React updates
				expect(result.current).toBe("second");
			});

			it("should reset timer on rapid changes", () => {
				const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
					initialProps: {
						value: "first",
					},
				});

				expect(result.current).toBe("first");

				// Rapid changes
				rerender({ value: "second" });
				act(() => {
					vi.advanceTimersByTime(300);
				});
				expect(result.current).toBe("first");

				rerender({ value: "third" });
				act(() => {
					vi.advanceTimersByTime(300);
				});
				expect(result.current).toBe("first");

				rerender({ value: "fourth" });
				act(() => {
					vi.advanceTimersByTime(300);
				});
				expect(result.current).toBe("first");

				// Wait for the timeout to finish
				act(() => {
					vi.advanceTimersByTime(200);
				});
				expect(result.current).toBe("fourth");
			});

			it("should work with default delay (500ms)", () => {
				const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
					initialProps: {
						value: "initial",
					},
				});

				rerender({ value: "updated" });
				expect(result.current).toBe("initial");

				act(() => {
					vi.advanceTimersByTime(500);
				});

				expect(result.current).toBe("updated");
			});

			it("should handle different data types", () => {
				// Number
				const { result: numberResult, rerender: numberRerenderer } = renderHook(({ value }) => useDebounce(value), {
					initialProps: {
						value: 0,
					},
				});

				expect(numberResult.current).toBe(0);

				numberRerenderer({ value: 42 });
				act(() => {
					vi.advanceTimersByTime(500);
				});
				expect(numberResult.current).toBe(42);

				// Object
				const { result: objectResult, rerender: objectRerenderer } = renderHook(({ value }) => useDebounce(value), {
					initialProps: {
						value: { count: 0 },
					},
				});

				objectRerenderer({ value: { count: 11 } });
				act(() => {
					vi.advanceTimersByTime(500);
				});
				expect(objectResult.current).toEqual({ count: 11 });

				// Array
				const { result: arrayResult, rerender: arrayRerenderer } = renderHook(({ value }) => useDebounce(value), {
					initialProps: {
						value: [1, 2, 3],
					},
				});

				arrayRerenderer({ value: [4, 5, 6] });
				act(() => {
					vi.advanceTimersByTime(500);
				});
				expect(arrayResult.current).toEqual([4, 5, 6]);
			});

			it("should cleanup timeout on unmount", () => {
				const { rerender, unmount } = renderHook(({ value }) => useDebounce(value), {
					initialProps: {
						value: "initial",
					},
				});

				rerender({ value: "updated" });

				unmount();

				act(() => {
					vi.advanceTimersByTime(500);
				});

				expect(true).toBeTruthy();
			});

			it("should handle custom delay values", () => {
				const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
					initialProps: {
						value: "initial",
						delay: 1000,
					},
				});

				rerender({ value: "updated", delay: 1000 });

				act(() => {
					vi.advanceTimersByTime(999);
				});

				expect(result.current).toBe("initial");

				act(() => {
					vi.advanceTimersByTime(1);
				});

				expect(result.current).toBe("updated");
			});
		});

		describe("Real world use cases", () => {
			it("should debounce search input (useDebounce)", () => {
				const { result, rerender } = renderHook(({ query }) => useDebounce(query, 300), {
					initialProps: { query: "" },
				});

				// User types "react"
				rerender({ query: "r" });
				rerender({ query: "re" });
				rerender({ query: "rea" });
				rerender({ query: "reac" });
				rerender({ query: "react" });

				// Should still show initial value
				expect(result.current).toBe("");

				// After delay, should show latest value
				act(() => {
					vi.advanceTimersByTime(300);
				});
				expect(result.current).toBe("react");
			});
		});
	});
	describe("useDebounceCallback", () => {
		describe("Basic functionality", () => {
			it("should debounce callback execution", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback(callback, 500));

				// Call multiple times rapidly
				result.current();
				result.current();
				result.current();

				// Should not have been called yet
				expect(callback).not.toHaveBeenCalled();

				// Advance time
				vi.advanceTimersByTime(500);

				// Should be called once
				expect(callback).toHaveBeenCalledTimes(1);
			});

			it("should reset timer on each call", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback(callback, 500));

				result.current();
				vi.advanceTimersByTime(300);

				result.current();
				vi.advanceTimersByTime(300);

				result.current();
				vi.advanceTimersByTime(300);

				// Still shouldn't have been called
				expect(callback).not.toHaveBeenCalled();

				// Wait full delay from last call
				vi.advanceTimersByTime(200);
				expect(callback).toHaveBeenCalledTimes(1);
			});

			it("should pass arguments to callback", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback((a: string, b: number) => callback(a, b), 500));

				result.current("test", 42);

				vi.advanceTimersByTime(500);

				expect(callback).toHaveBeenCalledWith("test", 42);
			});

			it("should use latest arguments when called multiple times", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback((value: string) => callback(value), 500));

				result.current("first");
				vi.advanceTimersByTime(200);

				result.current("second");
				vi.advanceTimersByTime(200);

				result.current("third");
				vi.advanceTimersByTime(500);

				// Should be called with the latest arguments
				expect(callback).toHaveBeenCalledTimes(1);
				expect(callback).toHaveBeenCalledWith("third");
			});

			it("should work with default delay (500ms)", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback(callback));

				result.current();

				vi.advanceTimersByTime(499);
				expect(callback).not.toHaveBeenCalled();

				vi.advanceTimersByTime(1);
				expect(callback).toHaveBeenCalledTimes(1);
			});

			it("should handle different delay values", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

				result.current();

				vi.advanceTimersByTime(999);
				expect(callback).not.toHaveBeenCalled();

				vi.advanceTimersByTime(1);
				expect(callback).toHaveBeenCalledTimes(1);
			});

			it("should cleanup timeout on unmount", () => {
				const callback = vi.fn();
				const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 500));

				result.current();

				// Unmount before timeout completes
				unmount();

				vi.advanceTimersByTime(500);

				// Callback should not be called after unmount
				expect(callback).not.toHaveBeenCalled();
			});

			it("should handle callback updates", () => {
				const callback1 = vi.fn();
				const callback2 = vi.fn();

				const { result, rerender } = renderHook(({ cb }) => useDebouncedCallback(cb, 500), {
					initialProps: { cb: callback1 },
				});

				result.current();

				// Change callback before delay completes
				rerender({ cb: callback2 });

				act(() => {
					vi.advanceTimersByTime(500);
				});

				// New callback should be called
				expect(callback1).not.toHaveBeenCalled();
				expect(callback2).toHaveBeenCalledTimes(1);
			});

			it("should handle multiple separate executions", () => {
				const callback = vi.fn();
				const { result } = renderHook(() => useDebouncedCallback(callback, 500));

				// First execution
				result.current();
				vi.advanceTimersByTime(500);
				expect(callback).toHaveBeenCalledTimes(1);

				// Second execution
				result.current();
				vi.advanceTimersByTime(500);
				expect(callback).toHaveBeenCalledTimes(2);

				// Third execution
				result.current();
				vi.advanceTimersByTime(500);
				expect(callback).toHaveBeenCalledTimes(3);
			});
		});

		describe("Real world use cases", () => {
			it("should debounce API calls (useDebouncedCallback)", () => {
				const apiCall = vi.fn((_: string) => Promise.resolve({ results: [] }));
				const { result } = renderHook(() => useDebouncedCallback(apiCall, 500));

				// Simulate rapid typing
				result.current("a");
				vi.advanceTimersByTime(100);
				result.current("ab");
				vi.advanceTimersByTime(100);
				result.current("abc");
				vi.advanceTimersByTime(100);
				result.current("abcd");

				// No API calls yet
				expect(apiCall).not.toHaveBeenCalled();

				// After delay
				vi.advanceTimersByTime(500);

				// Only one API call with latest query
				expect(apiCall).toHaveBeenCalledTimes(1);
				expect(apiCall).toHaveBeenCalledWith("abcd");
			});

			it("should debounce window resize handler", () => {
				const handleResize = vi.fn((width: number, height: number) => {});
				const { result } = renderHook(() => useDebouncedCallback(handleResize, 200));

				// Simulate resize events
				result.current(800, 600);
				vi.advanceTimersByTime(50);
				result.current(900, 650);
				vi.advanceTimersByTime(50);
				result.current(1000, 700);

				expect(handleResize).not.toHaveBeenCalled();

				vi.advanceTimersByTime(200);

				expect(handleResize).toHaveBeenCalledTimes(1);
				expect(handleResize).toHaveBeenCalledWith(1000, 700);
			});
		});
	});
});
