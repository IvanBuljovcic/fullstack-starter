import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useEffect, useState } from "react";
import { LoadingAnnouncer } from "./loading-announcer";

const meta = {
	title: "Accessibility/Announcer/Loading",
	component: LoadingAnnouncer,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Announces loading states to screen readers. The announcements are not visible but are read by assistive technologies. Check your browser console or screen reader to hear the announcements.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: "radio",
			options: ["loading", "success", "error"],
			description: "Current loading status",
		},
		loadingMessage: {
			control: "text",
			description: "Message announced when status is 'loading'",
		},
		completedMessage: {
			control: "text",
			description: "Message announced when status is 'success'",
		},
		errorMessage: {
			control: "text",
			description: "Message announced when status is 'error'",
		},
		delay: {
			control: "number",
			description: "Delay in milliseconds before announcing loading message (default: 1000ms)",
		},
	},
} satisfies Meta<typeof LoadingAnnouncer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
	args: {
		status: "loading",
		loadingMessage: "Loading data, please wait...",
		completedMessage: "Data loaded successfully",
		errorMessage: "Failed to load data",
		delay: 1000,
	},
};

export const Success: Story = {
	args: {
		status: "success",
		loadingMessage: "Loading data, please wait...",
		completedMessage: "Data loaded successfully",
		errorMessage: "Failed to load data",
	},
};

export const OnErrorState: Story = {
	args: {
		status: "error",
		loadingMessage: "Loading data, please wait...",
		completedMessage: "Data loaded successfully",
		errorMessage: "Failed to load data",
	},
};

export const CustomMessages: Story = {
	args: {
		status: "loading",
		loadingMessage: "Fetching your profile information...",
		completedMessage: "Profile loaded",
		errorMessage: "Could not load profile",
		delay: 500,
	},
};

// Interactive example showing state transitions
const InteractiveExample = () => {
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
	const [isVisible, setIsVisible] = useState(false);

	const simulateDataFetch = useCallback(() => {
		setIsVisible(true);
		setStatus("loading");

		setTimeout(() => {
			const success = Math.random() > 0.3;
			setStatus(success ? "success" : "error");

			setTimeout(() => {
				setIsVisible(false);
			}, 2000);
		}, 2000);
	}, []);

	useEffect(() => {
		simulateDataFetch();
	}, [simulateDataFetch]);

	return (
		<div style={{ padding: "2rem", textAlign: "center" }}>
			<h3 style={{ marginBottom: "1rem" }}>Simulated Data Fetch</h3>
			<div
				style={{
					padding: "1rem",
					borderRadius: "8px",
					backgroundColor: status === "loading" ? "#e0f2fe" : status === "success" ? "#dcfce7" : "#fee2e2",
					marginBottom: "1rem",
				}}
			>
				<p style={{ margin: 0, fontWeight: 600 }}>
					Status: {status === "loading" ? "⏳ Loading..." : status === "success" ? "✅ Success" : "❌ Error"}
				</p>
			</div>

			<button
				onClick={simulateDataFetch}
				style={{
					padding: "0.5rem 1rem",
					borderRadius: "6px",
					border: "none",
					backgroundColor: "#3b82f6",
					color: "white",
					cursor: "pointer",
					fontWeight: 500,
				}}
				type="button"
			>
				Fetch Data Again
			</button>

			<p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}>
				Screen readers will announce: "
				<strong>{status === "loading" ? "Loading..." : status === "success" ? "Success!" : "Error occurred"}</strong>"
			</p>

			{isVisible && (
				<LoadingAnnouncer
					completedMessage="Success!"
					delay={500}
					errorMessage="Error occurred"
					loadingMessage="Loading..."
					status={status}
				/>
			)}
		</div>
	);
};

export const Interactive = {
	args: {
		status: "loading",
		loadingMessage: "Loading...",
		completedMessage: "Success!",
		errorMessage: "Error occurred",
		delay: 500,
	},
	render: () => <InteractiveExample />,
	parameters: {
		docs: {
			description: {
				story:
					"Click the button to simulate a data fetch. Screen readers will announce the loading state and the result. This example demonstrates real-world usage in a component that fetches data.",
			},
		},
	},
} satisfies StoryObj<typeof meta>;

// Usage example with React Query
const UsageWithReactQuery = () => {
	const [triggerFetch, setTriggerFetch] = useState(0);
	const [data, setData] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		setData(null);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			if (Math.random() > 0.3) {
				setData("User data loaded successfully");
			} else {
				throw new Error("Network error");
			}
		} catch (err) {
			setError(err as Error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (triggerFetch > 0) {
			fetchData();
		}
	}, [triggerFetch, fetchData]);

	const status = isLoading ? "loading" : error ? "error" : data ? "success" : "loading";

	return (
		<div style={{ padding: "2rem", maxWidth: "500px" }}>
			<h3 style={{ marginBottom: "1rem" }}>Usage with Data Fetching</h3>

			<div
				style={{
					padding: "1.5rem",
					borderRadius: "8px",
					backgroundColor: "#f8fafc",
					border: "1px solid #e2e8f0",
					marginBottom: "1rem",
				}}
			>
				{isLoading && <p>⏳ Loading user data...</p>}
				{error && <p style={{ color: "#dc2626" }}>❌ {error.message}</p>}
				{data && <p style={{ color: "#16a34a" }}>✅ {data}</p>}
				{!isLoading && !error && !data && <p>Click the button to load data</p>}
			</div>

			<button
				onClick={() => setTriggerFetch((prev) => prev + 1)}
				style={{
					padding: "0.5rem 1rem",
					borderRadius: "6px",
					border: "none",
					backgroundColor: "#3b82f6",
					color: "white",
					cursor: "pointer",
					fontWeight: 500,
				}}
				type="button"
			>
				Load User Data
			</button>

			<div
				style={{
					marginTop: "1.5rem",
					padding: "1rem",
					backgroundColor: "#fef3c7",
					borderRadius: "6px",
					fontSize: "0.875rem",
				}}
			>
				<strong>📢 Screen Reader Announcements:</strong>
				<br />• Loading state announced after 500ms
				<br />• Success/error announced immediately
			</div>

			{triggerFetch > 0 && (
				<LoadingAnnouncer
					completedMessage="User data loaded successfully"
					delay={500}
					errorMessage="Failed to load user data"
					loadingMessage="Loading user data, please wait"
					status={status}
				/>
			)}
		</div>
	);
};

export const UsageExample = {
	args: {
		status: "loading",
		loadingMessage: "Loading user data, please wait",
		completedMessage: "User data loaded successfully",
		errorMessage: "Failed to load user data",
		delay: 500,
	},
	render: () => <UsageWithReactQuery />,
	parameters: {
		docs: {
			description: {
				story:
					"Real-world usage example showing how to integrate LoadingAnnouncer with data fetching. The component automatically announces different states to screen readers, improving accessibility for users with assistive technologies.",
			},
		},
	},
} satisfies StoryObj<typeof meta>;
