"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Internal filter model - used consistently across your app
 * Adapters will translate this to API-specific parameters
 */
type InternalFilters = {
	search?: string;
	category?: string;
	sizes?: string[];
};

type UseFilterParamsReturn = {
	filters: InternalFilters;
	updateFilter: <K extends keyof InternalFilters>(key: K, value: InternalFilters[K]) => void;
	clearFilter: (key: keyof InternalFilters) => void;
	clearAllFilters: () => void;
};

/**
 * Hook for managing URL-synced filters
 * Works with internal filter model - adapters handle API translation
 */
export const useFilterParams = (initialFilters: InternalFilters = {}): UseFilterParamsReturn => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [filters, setFilters] = useState<InternalFilters>(() => {
		const urlFilters: InternalFilters = {};

		// Read from URL
		const search = searchParams.get("search") || searchParams.get("q"); // Support both for flexibility
		if (search) {
			urlFilters.search = search;
		}

		const category = searchParams.get("category");
		if (category) {
			urlFilters.category = category;
		}

		const sizes = searchParams.get("sizes");
		if (sizes) {
			urlFilters.sizes = sizes.split(",").filter(Boolean);
		}

		return { ...initialFilters, ...urlFilters };
	});

	const updateURL = useCallback(
		(newFilters: InternalFilters) => {
			const params = new URLSearchParams();

			if (newFilters.search) {
				params.set("search", newFilters.search);
			}

			if (newFilters.category) {
				params.set("category", newFilters.category);
			}

			if (newFilters.sizes && newFilters.sizes.length > 0) {
				params.set("sizes", newFilters.sizes.join(","));
			}

			const newUrl = params.toString() ? `?${params.toString()}` : "/";
			router.push(newUrl, { scroll: false });
		},
		[router]
	);

	const updateFilter = useCallback(
		<K extends keyof InternalFilters>(key: K, value: InternalFilters[K]) => {
			const newFilters = { ...filters, [key]: value };

			setFilters(newFilters);
			updateURL(newFilters);
		},
		[filters, updateURL]
	);

	const clearFilter = useCallback(
		(key: keyof InternalFilters) => {
			const newFilters = { ...filters };

			delete newFilters[key];

			setFilters(newFilters);
			updateURL(newFilters);
		},
		[filters, updateURL]
	);

	const clearAllFilters = useCallback(() => {
		setFilters({});

		router.push("/", { scroll: false });
	}, [router]);

	// Sync with URL changes (back/forward navigation)
	useEffect(() => {
		const urlFilters: InternalFilters = {};

		const search = searchParams.get("search") || searchParams.get("q");
		if (search) {
			urlFilters.search = search;
		}

		const category = searchParams.get("category");
		if (category) {
			urlFilters.category = category;
		}

		const sizes = searchParams.get("sizes");
		if (sizes) {
			urlFilters.sizes = sizes.split(",").filter(Boolean);
		}

		// Only update if different
		const currentSizes = filters.sizes || [];
		const urlSizes = urlFilters.sizes || [];
		const currentSearch = filters.search || "";
		const urlSearch = urlFilters.search || "";
		const currentCategory = filters.category || "";
		const urlCategory = urlFilters.category || "";

		const sizesChanged = JSON.stringify(currentSizes.sort()) !== JSON.stringify(urlSizes.sort());
		const searchChanged = currentSearch !== urlSearch;
		const categoryChanged = currentCategory !== urlCategory;

		if (sizesChanged || searchChanged || categoryChanged) {
			setFilters(urlFilters);
		}
	}, [searchParams, filters.search, filters.category, filters.sizes]);

	return {
		filters,
		updateFilter,
		clearFilter,
		clearAllFilters,
	};
};
