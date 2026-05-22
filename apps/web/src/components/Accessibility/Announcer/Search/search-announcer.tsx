"use client";
import { useEffect, useRef } from "react";
import { useAnnouncement } from "@/providers/AnnouncementProvider";

type StatusType = "loading" | "error" | "success";

type SearchAnnouncerProps = {
	query: string;
	resultCount?: number;
	status: StatusType;
	totalTime?: number;
};

export const SearchAnnouncer = ({ query, resultCount, status, totalTime }: SearchAnnouncerProps) => {
	const { announce } = useAnnouncement();
	const previousQuery = useRef<string>("");

	useEffect(() => {
		if (!query || query === previousQuery.current) {
			return;
		}
		previousQuery.current = query;

		switch (status) {
			case "loading":
				return announce(`Searching for ${query}`);
			case "success": {
				const timeText = totalTime ? ` in ${totalTime} milliseconds` : "";
				const resultText = resultCount === 1 ? "result" : "results";

				return announce(`Found ${resultCount} ${resultText} for "${query}"${timeText}`);
			}
			case "error":
				return announce(`Encountered an error while searching for ${query}`);
			default:
				return;
		}
	}, [query, resultCount, status, totalTime, announce]);

	return null;
};
