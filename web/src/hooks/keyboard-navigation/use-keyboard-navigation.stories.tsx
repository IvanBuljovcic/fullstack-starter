import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { useGridNavigation } from "./use-grid-navigation";
import { useKeyboardNavigation } from "./use-keyboard-navigation";

const meta = {
	title: "Hooks/useKeyboardNavigation",
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: "Custom hooks for keyboard navigation, focus management, and grid navigation patterns.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta;

export default meta;

// Basic keyboard navigation
const BasicExample = () => {
	const [lastKey, setLastKey] = useState<string>("");

	const { containerRef } = useKeyboardNavigation({
		onEnter: () => setLastKey("Enter"),
		onEscape: () => setLastKey("Escape"),
		onArrowUp: () => setLastKey("Arrow Up"),
		onArrowDown: () => setLastKey("Arrow Down"),
		onArrowLeft: () => setLastKey("Arrow Left"),
		onArrowRight: () => setLastKey("Arrow Right"),
	});

	return (
		<section
			aria-label="Keyboard navigation demo"
			ref={containerRef as React.RefObject<HTMLDivElement>}
			style={{
				padding: "2rem",
				border: "2px solid #3b82f6",
				borderRadius: "8px",
				minWidth: "400px",
			}}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: <Element is expected to be interactive>
			tabIndex={0}
		>
			<h3>Try keyboard navigation</h3>
			<p style={{ color: "#666", fontSize: "0.875rem" }}>Press Arrow keys, Enter, or Escape</p>
			<div
				style={{
					marginTop: "1rem",
					padding: "1rem",
					backgroundColor: "#f3f4f6",
					borderRadius: "6px",
				}}
			>
				<strong>Last key pressed:</strong> {lastKey || "None"}
			</div>
		</section>
	);
};

export const Basic = {
	render: () => <BasicExample />,
} satisfies StoryObj<typeof meta>;

// Modal with focus trap
const ModalExample = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { containerRef } = useKeyboardNavigation({
		onEscape: () => setIsOpen(false),
		trapFocus: true,
		restoreFocus: true,
	});

	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				style={{
					padding: "0.5rem 1rem",
					backgroundColor: "#3b82f6",
					color: "white",
					border: "none",
					borderRadius: "6px",
					cursor: "pointer",
				}}
				type="button"
			>
				Open Modal
			</button>
		);
	}

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				aria-modal="true"
				ref={containerRef as React.RefObject<HTMLDivElement>}
				role="dialog"
				style={{
					backgroundColor: "white",
					padding: "2rem",
					borderRadius: "8px",
					maxWidth: "400px",
					width: "100%",
				}}
			>
				<h3 style={{ marginBottom: "1rem" }}>Modal Dialog</h3>
				<p style={{ marginBottom: "1rem", color: "#666" }}>
					Focus is trapped inside this modal. Press Tab to cycle through focusable elements, or Escape to close.
				</p>
				<div style={{ display: "flex", gap: "0.5rem" }}>
					<button
						style={{
							padding: "0.5rem 1rem",
							backgroundColor: "#3b82f6",
							color: "white",
							border: "none",
							borderRadius: "6px",
							cursor: "pointer",
						}}
						type="button"
					>
						Action 1
					</button>
					<button
						style={{
							padding: "0.5rem 1rem",
							backgroundColor: "#10b981",
							color: "white",
							border: "none",
							borderRadius: "6px",
							cursor: "pointer",
						}}
						type="button"
					>
						Action 2
					</button>
					<button
						onClick={() => setIsOpen(false)}
						style={{
							padding: "0.5rem 1rem",
							backgroundColor: "#ef4444",
							color: "white",
							border: "none",
							borderRadius: "6px",
							cursor: "pointer",
						}}
						type="button"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export const FocusTrap = {
	render: () => <ModalExample />,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				story: "Modal with focus trapping. Tab cycles through buttons, Escape closes and restores focus.",
			},
		},
	},
} satisfies StoryObj<typeof meta>;

// Dropdown menu
const DropdownExample = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState("Option 1");

	const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

	const { containerRef } = useKeyboardNavigation({
		onEscape: () => setIsOpen(false),
		onEnter: () => setIsOpen(!isOpen),
	});

	return (
		<div style={{ position: "relative" }}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				style={{
					padding: "0.5rem 1rem",
					backgroundColor: "white",
					border: "1px solid #d1d5db",
					borderRadius: "6px",
					cursor: "pointer",
					minWidth: "200px",
					textAlign: "left",
				}}
				type="button"
			>
				{selected} ▼
			</button>

			{isOpen && (
				<div
					ref={containerRef as React.RefObject<HTMLDivElement>}
					role="menu"
					style={{
						position: "absolute",
						top: "100%",
						left: 0,
						marginTop: "0.25rem",
						backgroundColor: "white",
						border: "1px solid #d1d5db",
						borderRadius: "6px",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
						minWidth: "200px",
						zIndex: 10,
					}}
				>
					{options.map((option) => (
						<button
							key={option}
							onClick={() => {
								setSelected(option);
								setIsOpen(false);
							}}
							role="menuitem"
							style={{
								width: "100%",
								padding: "0.5rem 1rem",
								textAlign: "left",
								border: "none",
								backgroundColor: selected === option ? "#eff6ff" : "transparent",
								cursor: "pointer",
							}}
							type="button"
						>
							{option}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export const Dropdown = {
	render: () => <DropdownExample />,
	parameters: {
		docs: {
			description: {
				story: "Dropdown menu with Escape to close and Enter to toggle.",
			},
		},
	},
} satisfies StoryObj<typeof meta>;

// Grid navigation
const GridExample = () => {
	const [selected, setSelected] = useState<number | null>(null);
	const [hovered, setHovered] = useState<number | null>(null);
	const { gridRef } = useGridNavigation(4);

	const products = Array.from({ length: 12 }, (_, i) => ({
		id: i + 1,
		name: `Product ${i + 1}`,
	}));

	return (
		<div>
			<h3 style={{ marginBottom: "1rem" }}>Product Grid</h3>
			<p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1rem" }}>
				Click a product, then use arrow keys to navigate
			</p>
			<ul
				ref={gridRef as React.RefObject<HTMLUListElement>}
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(4, 1fr)",
					gap: "1rem",
					maxWidth: "600px",
				}}
			>
				{products.map((product, index) => (
					<li
						data-navigation="grid-cell"
						key={product.id}
						onClick={() => setSelected(product.id)}
						onFocus={() => setSelected(product.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setSelected(product.id);
							}
						}}
						onMouseEnter={() => setHovered(product.id)}
						onMouseLeave={() => setHovered(null)}
						style={{
							padding: "1.5rem",
							border: `2px solid ${selected === product.id ? "#3b82f6" : "#e5e7eb"}`,
							borderRadius: "8px",
							textAlign: "center",
							cursor: "pointer",
							backgroundColor: selected === product.id ? "#eff6ff" : "white",
							outline: hovered === product.id ? "2px solid #3b82f6" : "2px solid transparent",
							transition: "all 0.2s",
						}}
						tabIndex={index === 0 ? 0 : -1}
					>
						<div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📦</div>
						<div style={{ fontWeight: 500 }}>{product.name}</div>
					</li>
				))}
			</ul>
			{selected && (
				<div
					style={{
						marginTop: "1rem",
						padding: "1rem",
						backgroundColor: "#f3f4f6",
						borderRadius: "6px",
					}}
				>
					<strong>Selected:</strong> Product {selected}
				</div>
			)}
		</div>
	);
};

export const Grid = {
	render: () => <GridExample />,
	parameters: {
		docs: {
			description: {
				story: "2D grid navigation using arrow keys. Perfect for product grids or image galleries.",
			},
		},
	},
} satisfies StoryObj<typeof meta>;

// Tab navigation example
const TabsExample = () => {
	const [activeTab, setActiveTab] = useState(0);
	const tabs = ["Profile", "Settings", "Notifications"];

	const { containerRef } = useKeyboardNavigation({
		onArrowLeft: () => setActiveTab((prev) => Math.max(0, prev - 1)),
		onArrowRight: () => setActiveTab((prev) => Math.min(tabs.length - 1, prev + 1)),
	});

	return (
		<div style={{ minWidth: "400px" }}>
			<div
				ref={containerRef as React.RefObject<HTMLDivElement>}
				role="tablist"
				style={{
					display: "flex",
					borderBottom: "2px solid #e5e7eb",
					marginBottom: "1rem",
				}}
			>
				{tabs.map((tab, index) => (
					<button
						aria-selected={activeTab === index}
						key={tab}
						onClick={() => setActiveTab(index)}
						role="tab"
						style={{
							padding: "0.75rem 1.5rem",
							border: "none",
							backgroundColor: "transparent",
							borderBottom: `2px solid ${activeTab === index ? "#3b82f6" : "transparent"}`,
							color: activeTab === index ? "#3b82f6" : "#666",
							cursor: "pointer",
							fontWeight: activeTab === index ? 600 : 400,
							marginBottom: "-2px",
						}}
						tabIndex={activeTab === index ? 0 : -1}
						type="button"
					>
						{tab}
					</button>
				))}
			</div>
			<div role="tabpanel" style={{ padding: "1rem" }}>
				<h4>{tabs[activeTab]} Content</h4>
				<p style={{ color: "#666" }}>This is the content for {tabs[activeTab].toLowerCase()}.</p>
			</div>
			<p style={{ fontSize: "0.875rem", color: "#666", marginTop: "1rem" }}>Use Left/Right arrows to navigate tabs</p>
		</div>
	);
};

export const Tabs = {
	render: () => <TabsExample />,
	parameters: {
		docs: {
			description: {
				story: "Horizontal tab navigation with arrow keys.",
			},
		},
	},
} satisfies StoryObj<typeof meta>;
