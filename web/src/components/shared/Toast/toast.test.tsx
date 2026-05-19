import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnnouncementProvider } from "@/providers/AnnouncementProvider";
import { toast, toastManager } from "./toast-manager";
import { ToastProvider } from "./toast-provider";

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<AnnouncementProvider>
		<ToastProvider maxToasts={3}>{children}</ToastProvider>
	</AnnouncementProvider>
);

describe("Toast System", () => {
	describe("Toast Manager", () => {
		beforeEach(() => {
			// Clear all toasts before each test
			toastManager.dismissAll();
		});

		it("should create a toast with success variant", () => {
			const id = toast.success("Success message");
			expect(id).toBeDefined();
		});

		it("should create a toast with error variant", () => {
			const id = toast.error("Error message");
			expect(id).toBeDefined();
		});

		it("should create a toast with warning variant", () => {
			const id = toast.warning("Warning message");
			expect(id).toBeDefined();
		});

		it("should create a toast with info variant", () => {
			const id = toast.info("Info message");
			expect(id).toBeDefined();
		});

		it("should dismiss a toast by id", () => {
			const id = toast.success("Test");
			const statsBefore = toastManager.getStats();
			expect(statsBefore.visible).toBe(1);

			toast.dismiss(id);
			const statsAfter = toastManager.getStats();
			expect(statsAfter.visible).toBe(0);
		});

		it("should dismiss all toasts", () => {
			toast.success("Toast 1");
			toast.info("Toast 2");
			toast.warning("Toast 3");

			const statsBefore = toastManager.getStats();
			expect(statsBefore.visible).toBe(3);

			toast.dismissAll();
			const statsAfter = toastManager.getStats();
			expect(statsAfter.visible).toBe(0);
		});

		it("should queue toasts when max is reached", () => {
			toastManager.setMaxToasts(2);

			toast.success("Toast 1");
			toast.success("Toast 2");
			toast.success("Toast 3"); // Should be queued

			const stats = toastManager.getStats();
			expect(stats.visible).toBe(2);
			expect(stats.queued).toBe(1);
		});

		it("should process queue when toast is dismissed", () => {
			toastManager.setMaxToasts(2);

			const id1 = toast.success("Toast 1");
			toast.success("Toast 2");
			toast.success("Toast 3"); // Queued

			toast.dismiss(id1);

			const stats = toastManager.getStats();
			expect(stats.visible).toBe(2);
			expect(stats.queued).toBe(0);
		});

		it("should prioritize error toasts in queue", () => {
			toastManager.setMaxToasts(1);

			toast.success("Toast 1");
			toast.info("Toast 2"); // Queued
			toast.error("Toast 3"); // Should jump to front of queue

			const stats = toastManager.getStats();
			expect(stats.queued).toBe(2);

			toast.dismissAll();
		});

		it("should set max toasts configuration", () => {
			toast.config.setMaxToasts(10);
			const stats = toastManager.getStats();
			expect(stats.maxToasts).toBe(10);
		});
	});

	describe("Toast Component Rendering", () => {
		beforeEach(() => {
			toastManager.dismissAll();
		});

		it("should render toast with title", () => {
			render(
				<TestWrapper>
					<button onClick={() => toast.success("Test title")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			expect(screen.getByText("Test title")).toBeInTheDocument();
		});

		it("should render toast with description", () => {
			render(
				<TestWrapper>
					<button
						onClick={() =>
							toast.success("Title", {
								description: "This is a description",
							})
						}
						type="button"
					>
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			expect(screen.getByText("Title")).toBeInTheDocument();
			expect(screen.getByText("This is a description")).toBeInTheDocument();
		});

		it("should render action button when provided", () => {
			render(
				<TestWrapper>
					<button
						onClick={() =>
							toast.success("Title", {
								action: {
									label: "Undo",
									onClick: () => {},
								},
							})
						}
						type="button"
					>
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button", { name: "Show Toast" });
			act(() => {
				button.click();
			});

			expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
		});

		it("should render dismiss button", () => {
			render(
				<TestWrapper>
					<button onClick={() => toast.success("Test")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button", { name: "Show Toast" });
			act(() => {
				button.click();
			});

			expect(screen.getByRole("button", { name: "Dismiss notification" })).toBeInTheDocument();
		});

		it("should have correct role for error toast", () => {
			render(
				<TestWrapper>
					<button onClick={() => toast.error("Error message")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			// Note: AnnouncementProvider also adds role="alert", so we get multiple
			const alerts = screen.getAllByRole("alert");
			const toastAlert = alerts.find((el) => el.textContent?.includes("Error message"));
			expect(toastAlert).toBeInTheDocument();
		});

		it("should have correct role for non-error toast", () => {
			render(
				<TestWrapper>
					<button onClick={() => toast.success("Success message")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			const successToast = screen.getByRole("status");
			expect(successToast).toBeInTheDocument();
		});
	});

	describe("Toast Interactions", () => {
		beforeEach(() => {
			toastManager.dismissAll();
		});

		it("should dismiss toast when dismiss button is clicked", async () => {
			const user = userEvent.setup();

			render(
				<TestWrapper>
					<button onClick={() => toast.success("Test")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const showButton = screen.getByRole("button", { name: "Show Toast" });
			await user.click(showButton);

			expect(screen.getByText("Test")).toBeInTheDocument();

			const dismissButton = screen.getByRole("button", { name: "Dismiss notification" });
			await user.click(dismissButton);

			await waitFor(() => {
				expect(screen.queryByText("Test")).not.toBeInTheDocument();
			});
		});

		it("should call action onClick when action button is clicked", async () => {
			const user = userEvent.setup();
			const actionFn = vi.fn();

			render(
				<TestWrapper>
					<button
						onClick={() =>
							toast.success("Test", {
								action: {
									label: "Action",
									onClick: actionFn,
								},
							})
						}
						type="button"
					>
						Show Toast
					</button>
				</TestWrapper>
			);

			const showButton = screen.getByRole("button", { name: "Show Toast" });
			await user.click(showButton);

			const actionButton = screen.getByRole("button", { name: "Action" });
			await user.click(actionButton);

			expect(actionFn).toHaveBeenCalledTimes(1);
		});

		it("should auto-dismiss toast after duration", async () => {
			vi.useFakeTimers();

			render(
				<TestWrapper>
					<button
						onClick={() =>
							toast.success("Test", {
								duration: 2000,
							})
						}
						type="button"
					>
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			expect(screen.getByText("Test")).toBeInTheDocument();

			act(() => {
				vi.advanceTimersByTime(2000);
			});

			await waitFor(() => {
				expect(screen.queryByText("Test")).not.toBeInTheDocument();
			});

			vi.useRealTimers();
		});
	});

	describe("Multiple Toasts", () => {
		beforeEach(() => {
			toastManager.dismissAll();
		});

		it("should render multiple toasts", () => {
			render(
				<TestWrapper>
					<button
						onClick={() => {
							toast.success("Toast 1");
							toast.info("Toast 2");
							toast.warning("Toast 3");
						}}
						type="button"
					>
						Show Toasts
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			expect(screen.getByText("Toast 1")).toBeInTheDocument();
			expect(screen.getByText("Toast 2")).toBeInTheDocument();
			expect(screen.getByText("Toast 3")).toBeInTheDocument();
		});

		it("should respect maxToasts limit", () => {
			render(
				<TestWrapper>
					<button
						onClick={() => {
							toast.success("Toast 1");
							toast.success("Toast 2");
							toast.success("Toast 3");
							toast.success("Toast 4"); // Should be queued (maxToasts is 3)
						}}
						type="button"
					>
						Show Toasts
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			// Only 3 should be visible
			const toasts = screen.getAllByRole("status");
			expect(toasts).toHaveLength(3);
		});
	});

	describe("Toast Container", () => {
		beforeEach(() => {
			toastManager.dismissAll();
		});

		it("should not render container when no toasts", () => {
			const { container } = render(<TestWrapper>{null}</TestWrapper>);

			// Container should not exist when there are no toasts
			const toastContainer = container.querySelector('[aria-live="polite"]');
			expect(toastContainer).not.toBeInTheDocument();
		});

		it("should render container with toasts", () => {
			render(
				<TestWrapper>
					<button onClick={() => toast.success("Test")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			const toastContainer = screen.getByRole("status").parentElement;
			expect(toastContainer).toHaveAttribute("aria-live", "polite");
		});
	});

	describe("Edge Cases", () => {
		beforeEach(() => {
			toastManager.dismissAll();
		});

		it("should handle empty title gracefully", () => {
			render(
				<TestWrapper>
					<button onClick={() => toast.success("")} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			const toastElement = screen.getByRole("status");
			expect(toastElement).toBeInTheDocument();
		});

		it("should handle long titles", () => {
			const longTitle = "This is a very long title that should still render properly without breaking the layout";

			render(
				<TestWrapper>
					<button onClick={() => toast.success(longTitle)} type="button">
						Show Toast
					</button>
				</TestWrapper>
			);

			const button = screen.getByRole("button");
			act(() => {
				button.click();
			});

			expect(screen.getByText(longTitle)).toBeInTheDocument();
		});

		it("should handle dismissing non-existent toast", () => {
			expect(() => toast.dismiss("non-existent-id")).not.toThrow();
		});

		it("should handle dismissAll when no toasts exist", () => {
			expect(() => toast.dismissAll()).not.toThrow();
		});
	});
});
