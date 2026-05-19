import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import React, { type ComponentType, type ErrorInfo } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SmartErrorBoundary, { type CustomErrorFallbackProps } from "./smart-error-boundary";

// Mock Next.js router
vi.mock("next/navigation", () => ({
	useRouter: vi.fn(),
}));

// Test component that throws an error
const ThrowError = ({ shouldThrow = true, message = "Test error" }: { shouldThrow?: boolean; message?: string }) => {
	if (shouldThrow) {
		throw new Error(message);
	}
	return <div>No Error</div>;
};

// Test component that uses a counter to control throwing
const ThrowErrorOnce = ({ throwOnCount = 1 }: { throwOnCount?: number }) => {
	const renderCount = React.useRef(0);
	renderCount.current += 1;

	if (renderCount.current === throwOnCount) {
		throw new Error("Controlled error");
	}

	return <div>No Error</div>;
};

// Helper to suppress console errors during tests
const suppressConsoleError = () => {
	const originalError = console.error;
	beforeEach(() => {
		console.error = vi.fn();
	});
	afterEach(() => {
		console.error = originalError;
	});
};

describe("SmartErrorBoundary", () => {
	const mockRouter = {
		push: vi.fn(),
		back: vi.fn(),
		refresh: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useRouter as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
	});

	suppressConsoleError();

	describe("Basic Error Catching", () => {
		it("should render children when no error occurs", () => {
			render(
				<SmartErrorBoundary context="TestComponent">
					<div>Child Content</div>
				</SmartErrorBoundary>
			);

			expect(screen.getByText("Child Content")).toBeInTheDocument();
		});

		it("should catch and display errors", () => {
			render(
				<SmartErrorBoundary context="TestComponent">
					<ThrowError message="Something went wrong" />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Something went wrong in TestComponent/)).toBeInTheDocument();
			expect(screen.getByText("Something went wrong")).toBeInTheDocument();
		});

		it("should display error details in development mode", () => {
			vi.stubEnv("NODE_ENV", "development");

			render(
				<SmartErrorBoundary context="TestComponent">
					<ThrowError message="Dev error" />
				</SmartErrorBoundary>
			);

			expect(screen.getByText("Error details")).toBeInTheDocument();

			vi.unstubAllEnvs();
		});

		it("should not display error details in production mode", () => {
			vi.stubEnv("NODE_ENV", "production");

			render(
				<SmartErrorBoundary context="TestComponent">
					<ThrowError message="Prod error" />
				</SmartErrorBoundary>
			);

			expect(screen.queryByText("Error details")).not.toBeInTheDocument();

			vi.unstubAllEnvs();
		});
	});

	describe("Retry Functionality", () => {
		it("should show retry button with correct attempts left", () => {
			render(
				<SmartErrorBoundary context="TestComponent" maxRetries={3}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Try Again \(3 attempts left\)/)).toBeInTheDocument();
		});

		it("should handle retry and decrement retry count", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent" maxRetries={3}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Try Again \(3 attempts left\)/)).toBeInTheDocument();

			const retryButton = screen.getByText(/Try Again \(3 attempts left\)/);
			await user.click(retryButton);

			// After first retry, the component still throws, so we catch it again with 2 attempts left
			// Use findByRole to be more specific and wait for the updated button
			await screen.findByRole("button", { name: /Try Again \(2 attempts left\)/i }, { timeout: 3000 });
		});

		it("should hide retry button when max retries reached", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent" maxRetries={1}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			const retryButton = screen.getByText(/Try Again \(1 attempts left\)/);
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument();
			});
		});

		it("should call onRetry callback when retry button is clicked", async () => {
			const user = userEvent.setup();
			const onRetry = vi.fn();

			render(
				<SmartErrorBoundary context="TestComponent" maxRetries={1} onRetry={onRetry}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			const retryButton = screen.getByRole("button", { name: /Try Again/ });
			await user.click(retryButton);

			await waitFor(() => {
				expect(onRetry).toHaveBeenCalled();
			});
		});

		// Todo: remove skipping
		it.skip("should successfully recover after retry when component stops throwing", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent">
					<ThrowErrorOnce throwOnCount={1} />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

			const retryButton = screen.getByRole("button", { name: /Try Again/ });
			await user.click(retryButton);

			await waitFor(() => {
				expect(screen.getByText("No Error")).toBeInTheDocument();
			});
		});
	});

	describe("Error Levels", () => {
		it("should render component level without navigation buttons by default", () => {
			render(
				<SmartErrorBoundary context="TestComponent" level="component">
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.queryByText("Refresh Page")).not.toBeInTheDocument();
			expect(screen.queryByText("Go Back")).not.toBeInTheDocument();
			expect(screen.queryByText("Go Home")).not.toBeInTheDocument();
		});

		it("should not show navigation buttons for page level when enableNavigation is false", () => {
			render(
				<SmartErrorBoundary context="TestComponent" enableNavigation={false} level="page">
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.queryByText("Refresh Page")).not.toBeInTheDocument();
			expect(screen.queryByText("Go Back")).not.toBeInTheDocument();
		});

		it("should show page navigation buttons when enableNavigation is true", () => {
			render(
				<SmartErrorBoundary context="TestComponent" enableNavigation={true} level="page">
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText("Refresh Page")).toBeInTheDocument();
			expect(screen.getByText("Go Back")).toBeInTheDocument();
		});

		it("should show app navigation buttons when enableNavigation is true", () => {
			render(
				<SmartErrorBoundary context="TestComponent" enableNavigation={true} level="app">
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText("Reload Application")).toBeInTheDocument();
			expect(screen.getByText("Go Home")).toBeInTheDocument();
		});

		it("should call router.refresh when Refresh Page is clicked", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent" enableNavigation={true} level="page">
					<ThrowError />
				</SmartErrorBoundary>
			);

			const refreshButton = screen.getByText("Refresh Page");
			await user.click(refreshButton);

			expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
		});

		it("should call router.back when Go Back is clicked", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent" enableNavigation={true} level="page">
					<ThrowError />
				</SmartErrorBoundary>
			);

			const backButton = screen.getByText("Go Back");
			await user.click(backButton);

			expect(mockRouter.back).toHaveBeenCalledTimes(1);
		});

		it("should call router.push when Go Home is clicked", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent" enableNavigation={true} level="app">
					<ThrowError />
				</SmartErrorBoundary>
			);

			const homeButton = screen.getByText("Go Home");
			await user.click(homeButton);

			expect(mockRouter.push).toHaveBeenCalledWith("/");
		});
	});

	describe("Custom Error Handler", () => {
		it("should call onError callback with correct parameters", () => {
			const onError = vi.fn();

			render(
				<SmartErrorBoundary context="TestContext" level="component" onError={onError}>
					<ThrowError message="Custom error" />
				</SmartErrorBoundary>
			);

			expect(onError).toHaveBeenCalledTimes(1);
			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({
					message: "Custom error",
				}),
				expect.any(Object),
				expect.objectContaining({
					context: "TestContext",
					level: "component",
					retryCount: 0,
					timestamp: expect.any(Date),
				})
			);
		});

		it("should include errorInfo in onError callback", () => {
			const onError = vi.fn();

			render(
				<SmartErrorBoundary context="TestContext" onError={onError}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			const errorInfo = onError.mock.calls[0][1] as ErrorInfo;
			expect(errorInfo).toHaveProperty("componentStack");
		});
	});

	describe("Custom Fallback Component", () => {
		it("should render custom fallback component", () => {
			const CustomFallback: ComponentType<CustomErrorFallbackProps> = ({ error, context }) => (
				<div>
					<h2>Custom Error UI</h2>
					<p>Error in {context}</p>
					<p>{error.message}</p>
				</div>
			);

			render(
				<SmartErrorBoundary context="CustomContext" fallback={CustomFallback}>
					<ThrowError message="Fallback test" />
				</SmartErrorBoundary>
			);

			expect(screen.getByText("Custom Error UI")).toBeInTheDocument();
			expect(screen.getByText("Error in CustomContext")).toBeInTheDocument();
			expect(screen.getByText("Fallback test")).toBeInTheDocument();
		});

		it("should pass all required props to custom fallback", () => {
			const CustomFallback: ComponentType<CustomErrorFallbackProps> = (props) => (
				<div>
					<span data-testid="retry-count">{props.retryCount}</span>
					<span data-testid="max-retries">{props.maxRetries}</span>
					<span data-testid="level">{props.level}</span>
					<span data-testid="context">{props.context}</span>
					<span data-testid="enable-nav">{props.enableNavigation.toString()}</span>
				</div>
			);

			render(
				<SmartErrorBoundary
					context="TestContext"
					enableNavigation={true}
					fallback={CustomFallback}
					level="page"
					maxRetries={5}
				>
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByTestId("retry-count")).toHaveTextContent("0");
			expect(screen.getByTestId("max-retries")).toHaveTextContent("5");
			expect(screen.getByTestId("level")).toHaveTextContent("page");
			expect(screen.getByTestId("context")).toHaveTextContent("TestContext");
			expect(screen.getByTestId("enable-nav")).toHaveTextContent("true");
		});
	});

	describe("Reset Keys", () => {
		it("should reset error boundary when resetKeys change", () => {
			let resetKey = "key1";

			const { rerender } = render(
				<SmartErrorBoundary context="TestComponent" resetKeys={[resetKey]}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

			// Change reset key to trigger reset
			resetKey = "key2";
			rerender(
				<SmartErrorBoundary context="TestComponent" resetKeys={[resetKey]}>
					<ThrowError shouldThrow={false} />
				</SmartErrorBoundary>
			);

			expect(screen.getByText("No Error")).toBeInTheDocument();
		});

		it("should handle multiple reset keys", () => {
			const { rerender } = render(
				<SmartErrorBoundary context="TestComponent" resetKeys={[1, "a", true]}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

			rerender(
				<SmartErrorBoundary context="TestComponent" resetKeys={[2, "b", false]}>
					<ThrowError shouldThrow={false} />
				</SmartErrorBoundary>
			);

			expect(screen.getByText("No Error")).toBeInTheDocument();
		});
	});

	describe("Custom className", () => {
		it("should apply custom className to wrapper", () => {
			const { container } = render(
				<SmartErrorBoundary className="custom-error-class" context="TestComponent">
					<div>Content</div>
				</SmartErrorBoundary>
			);

			expect(container.querySelector(".custom-error-class")).toBeInTheDocument();
		});
	});

	describe("Error Context Display", () => {
		it("should display the context in error message", () => {
			render(
				<SmartErrorBoundary context="UserProfile">
					<ThrowError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Something went wrong in UserProfile/)).toBeInTheDocument();
		});

		it("should handle different context names", () => {
			const contexts = ["Header", "Footer", "Sidebar", "MainContent"];

			contexts.forEach((context) => {
				const { unmount } = render(
					<SmartErrorBoundary context={context}>
						<ThrowError />
					</SmartErrorBoundary>
				);

				expect(screen.getByText(new RegExp(`Something went wrong in ${context}`))).toBeInTheDocument();
				unmount();
			});
		});
	});

	describe("Edge Cases", () => {
		it("should handle errors without error messages", () => {
			const ThrowEmptyError = () => {
				throw new Error();
			};

			render(
				<SmartErrorBoundary context="TestComponent">
					<ThrowEmptyError />
				</SmartErrorBoundary>
			);

			expect(screen.getByText(/Something went wrong in TestComponent/)).toBeInTheDocument();
		});

		it("should handle non-Error objects being thrown", () => {
			const ThrowString = () => {
				throw "String error";
			};

			render(
				<SmartErrorBoundary context="TestComponent">
					<ThrowString />
				</SmartErrorBoundary>
			);

			// Error boundary should still catch and display something
			expect(screen.getByText(/Something went wrong in TestComponent/)).toBeInTheDocument();
		});

		// Todo: remove skipping
		it.skip("should maintain state across multiple retry attempts", async () => {
			const user = userEvent.setup();

			render(
				<SmartErrorBoundary context="TestComponent" maxRetries={5}>
					<ThrowError />
				</SmartErrorBoundary>
			);

			// First retry
			let retryButton = screen.getByText(/Try Again \(5 attempts left\)/);
			await user.click(retryButton);

			await screen.findByRole("button", { name: /Try Again \(4 attempts left\)/i }, { timeout: 3000 });

			// Second retry
			retryButton = screen.getByRole("button", { name: /Try Again \(4 attempts left\)/i });
			await user.click(retryButton);

			await screen.findByRole("button", { name: /Try Again \(3 attempts left\)/i }, { timeout: 3000 });

			// Third retry
			retryButton = screen.getByRole("button", { name: /Try Again \(3 attempts left\)/i });
			await user.click(retryButton);

			await screen.findByRole("button", { name: /Try Again \(2 attempts left\)/i }, { timeout: 3000 });
		});
	});
});
