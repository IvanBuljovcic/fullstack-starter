/** biome-ignore-all lint/correctness/useUniqueElementIds: each story is a single-render component, there is no potential overlap with id names */
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AnnouncementProvider } from "@/providers/AnnouncementProvider";
import { toast } from "./toast-manager";
import { ToastProvider } from "./toast-provider";

const meta = {
	title: "Shared/Toast",
	component: ToastProvider,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"A flexible toast notification system with singleton pattern. Supports multiple variants, queueing, auto-dismiss, and integrates with screen reader announcements.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Examples
export const Success: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<button onClick={() => toast.success("Success!")} type="button">
						Show Success Toast
					</button>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

export const ErrorToast: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<button onClick={() => toast.error("Something went wrong")} type="button">
						Show Error Toast
					</button>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

export const Warning: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<button onClick={() => toast.warning("Please be careful")} type="button">
						Show Warning Toast
					</button>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

export const Info: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<button onClick={() => toast.info("Here's some information")} type="button">
						Show Info Toast
					</button>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

// With Description
export const WithDescription: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<button
						onClick={() =>
							toast.success("Profile updated", {
								description: "Your changes have been saved successfully.",
							})
						}
						type="button"
					>
						Show Toast with Description
					</button>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

// With Action Button
export const WithAction: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<button
						onClick={() =>
							toast.error("Failed to save", {
								description: "There was an error saving your changes.",
								action: {
									label: "Retry",
									onClick: () => {
										console.log("Retry clicked");
										toast.info("Retrying...");
									},
								},
							})
						}
						type="button"
					>
						Show Toast with Action
					</button>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

// Custom Duration
export const CustomDuration: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<div style={{ display: "flex", gap: "1rem" }}>
						<button
							onClick={() =>
								toast.info("Quick message", {
									duration: 2000,
								})
							}
							type="button"
						>
							2 seconds
						</button>
						<button
							onClick={() =>
								toast.info("Normal message", {
									duration: 5000,
								})
							}
							type="button"
						>
							5 seconds (default)
						</button>
						<button
							onClick={() =>
								toast.info("Long message", {
									duration: 10000,
								})
							}
							type="button"
						>
							10 seconds
						</button>
					</div>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

// Multiple Toasts
export const MultipleToasts: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
						<button
							onClick={() => {
								toast.success("First notification");
								toast.info("Second notification");
								toast.warning("Third notification");
							}}
							type="button"
						>
							Show 3 Toasts
						</button>
						<button
							onClick={() => {
								for (let i = 1; i <= 7; i++) {
									toast.success(`Notification ${i}`, {
										description: `This is notification number ${i}`,
									});
								}
							}}
							type="button"
						>
							Show 7 Toasts (Queue Demo)
						</button>
						<button onClick={() => toast.dismissAll()} type="button">
							Dismiss All
						</button>
					</div>
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
};

// Different Positions
export const Positions: Story = {
	args: {
		children: <></>,
	},
	render: () => {
		const [position, setPosition] = useState<
			"top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
		>("top-right");

		return (
			<AnnouncementProvider>
				<ToastProvider position={position}>
					<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
						<div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
							<button onClick={() => setPosition("top-right")} type="button">
								Top Right
							</button>
							<button onClick={() => setPosition("top-left")} type="button">
								Top Left
							</button>
							<button onClick={() => setPosition("top-center")} type="button">
								Top Center
							</button>
							<button onClick={() => setPosition("bottom-right")} type="button">
								Bottom Right
							</button>
							<button onClick={() => setPosition("bottom-left")} type="button">
								Bottom Left
							</button>
							<button onClick={() => setPosition("bottom-center")} type="button">
								Bottom Center
							</button>
						</div>
						<p style={{ fontSize: "0.875rem", color: "#666" }}>Current position: {position}</p>
						<button
							onClick={() =>
								toast.success("Toast notification", {
									description: `Positioned at ${position}`,
								})
							}
							type="button"
						>
							Show Toast
						</button>
					</div>
				</ToastProvider>
			</AnnouncementProvider>
		);
	},
};

// Form Submission Example
const FormExample = () => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const success = Math.random() > 0.3;

		if (success) {
			toast.success("Form submitted!", {
				description: "Your data has been saved successfully.",
			});
		} else {
			toast.error("Submission failed", {
				description: "Please check your connection and try again.",
				action: {
					label: "Retry",
					onClick: () => handleSubmit(e),
				},
			});
		}

		setIsLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px" }}>
			<input placeholder="Enter your name" required style={{ padding: "0.5rem" }} type="text" />
			<input placeholder="Enter your email" required style={{ padding: "0.5rem" }} type="email" />
			<button disabled={isLoading} style={{ padding: "0.5rem" }} type="submit">
				{isLoading ? "Submitting..." : "Submit Form"}
			</button>
		</form>
	);
};

export const FormSubmission: Story = {
	args: {
		children: (
			<AnnouncementProvider>
				<ToastProvider>
					<FormExample />
				</ToastProvider>
			</AnnouncementProvider>
		),
	},
	parameters: {
		docs: {
			description: {
				story: "Example showing toast notifications in a form submission flow with success and error handling.",
			},
		},
	},
};

// Interactive Playground
const PlaygroundExample = () => {
	const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success");
	const [title, setTitle] = useState("Notification title");
	const [description, setDescription] = useState("Optional description text");
	const [duration, setDuration] = useState(5000);
	const [withAction, setWithAction] = useState(false);

	const handleShow = () => {
		toast[variant](title, {
			description: description || undefined,
			duration,
			action: withAction
				? {
						label: "Action",
						onClick: () => toast.info("Action clicked!"),
					}
				: undefined,
		});
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "400px" }}>
			<div>
				<label htmlFor="variant" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
					Variant:
				</label>
				<select
					id="variant"
					onChange={(e) => setVariant(e.target.value as typeof variant)}
					style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
					value={variant}
				>
					<option value="success">Success</option>
					<option value="error">Error</option>
					<option value="warning">Warning</option>
					<option value="info">Info</option>
				</select>
			</div>

			<div>
				<label htmlFor="title" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
					Title:
				</label>
				<input
					id="title"
					onChange={(e) => setTitle(e.target.value)}
					style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
					type="text"
					value={title}
				/>
			</div>

			<div>
				<label htmlFor="description" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
					Description:
				</label>
				<input
					id="description"
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Optional"
					style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
					type="text"
					value={description}
				/>
			</div>

			<div>
				<label htmlFor="duration" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
					Duration: {duration}ms
				</label>
				<input
					id="duration"
					max={10000}
					min={1000}
					onChange={(e) => setDuration(Number(e.target.value))}
					step={1000}
					style={{ width: "100%", marginTop: "0.25rem" }}
					type="range"
					value={duration}
				/>
			</div>

			<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
				<input checked={withAction} id="action" onChange={(e) => setWithAction(e.target.checked)} type="checkbox" />
				<label htmlFor="action" style={{ fontSize: "0.875rem" }}>
					Include action button
				</label>
			</div>

			<button onClick={handleShow} style={{ padding: "0.75rem" }} type="button">
				Show Toast
			</button>
		</div>
	);
};

export const Playground: Story = {
	args: {
		children: <></>,
	},
	render: () => (
		<AnnouncementProvider>
			<ToastProvider>
				<PlaygroundExample />
			</ToastProvider>
		</AnnouncementProvider>
	),
	parameters: {
		docs: {
			description: {
				story: "Interactive playground to test different toast configurations.",
			},
		},
	},
};
