import clsx from "clsx";
import { LoadingAnnouncer } from "@/components/Accessibility/Announcer/Loading/loading-announcer";
import styles from "./loader.module.css";

interface LoaderProps {
	size?: "small" | "medium" | "large";
	className?: string;
}

export const Loader = ({ size = "medium", className }: LoaderProps) => {
	return (
		<>
			<LoadingAnnouncer />
			<div className={clsx(styles.loader, styles[size], className)} />
		</>
	);
};
