/**
 * Generic adapter interface for making data fetching API-agnostic
 *
 * @template TItem - The item type (e.g., Product, User)
 * @template TFilters - The filter type (e.g., ProductFilters)
 * @template TResponse - The API response structure
 * @template TPageParam - The pagination parameter type (number for page, object for cursor-based)
 */
export interface DataAdapter<TItem, TFilters = Record<string, unknown>, TResponse = unknown, TPageParam = number> {
	/**
	 * Build the URL for fetching data
	 * @param filters - The internal filter object
	 * @param pageParam - The pagination parameter (page number, skip value, cursor, etc.)
	 * @returns The relative URL path (without base URL)
	 */
	buildURL(filters: TFilters, pageParam: TPageParam): string;

	/**
	 * Parse the API response into a standardized format
	 * @param response - The raw API response
	 * @returns Parsed response with items and pagination info
	 */
	parseResponse(response: TResponse): {
		items: TItem[];
		total: number;
		hasNextPage: boolean;
	};

	/**
	 * Calculate the next page parameter
	 * @param lastPage - The last page's parsed response
	 * @param allPages - All pages fetched so far
	 * @returns The next page parameter, or undefined if no more pages
	 */
	getNextPageParam(
		lastPage: ReturnType<this["parseResponse"]>,
		allPages: ReturnType<this["parseResponse"]>[]
	): TPageParam | undefined;

	/**
	 * The initial page parameter (1 for page-based, 0 for skip-based, null for cursor-based)
	 */
	initialPageParam: TPageParam;
}

/**
 * Generic fetcher function signature
 */
export type Fetcher = <T>(url: string, options?: RequestInit) => Promise<T>;
