import type { DataAdapter } from "./data-adapter";

/**
 * Internal filter model (same across all adapters)
 */
export type InternalProductFilters = {
	search?: string;
	category?: string;
	sizes?: string[]; // Your backend might support sizes
};

/**
 * Product type for your custom backend
 */
export type CustomProduct = {
	id: number;
	name: string;
	description: string;
	price: number;
	rating: number;
	category: string;
	imageUrl?: string;
	sizes?: string[];
	// ... your custom fields
};

/**
 * Your custom backend response structure
 */
export type CustomProductsResponse = {
	data: {
		products: CustomProduct[];
		sizes: string[]; // Available size filters
	};
	pagination: {
		page: number;
		totalCount: number;
		hasNextPage: boolean;
	};
};

/**
 * Adapter for your custom backend API
 * Handles: page-based pagination, nested response structure
 */
export class CustomBackendProductAdapter
	implements DataAdapter<CustomProduct, InternalProductFilters, CustomProductsResponse, number>
{
	initialPageParam = 1; // Page-based starts at 1

	buildURL(filters: InternalProductFilters, page: number): string {
		const params = new URLSearchParams();
		params.set("page", page.toString());

		// Map internal filters to your API params
		if (filters.search) {
			params.set("search", filters.search); // Your API uses "search", not "q"
		}

		if (filters.category) {
			params.set("category", filters.category);
		}

		if (filters.sizes && filters.sizes.length > 0) {
			params.set("sizes", filters.sizes.join(","));
		}

		// Your API endpoint structure
		return `/api/products?${params.toString()}`;
	}

	parseResponse(response: CustomProductsResponse) {
		return {
			items: response.data.products,
			total: response.pagination.totalCount,
			hasNextPage: response.pagination.hasNextPage,
		};
	}

	getNextPageParam(lastPage: ReturnType<this["parseResponse"]>, _allPages: ReturnType<this["parseResponse"]>[]) {
		// For page-based pagination, just increment
		return lastPage.hasNextPage ? _allPages.length + 1 : undefined;
	}
}
