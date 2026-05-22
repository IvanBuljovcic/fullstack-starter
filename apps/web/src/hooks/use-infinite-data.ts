"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { DataAdapter, Fetcher } from "@/adapters/data-adapter";

/**
 * Generic infinite scroll data fetching hook
 * API-agnostic - works with any adapter
 *
 * @template TItem - The item type (Product, User, etc.)
 * @template TFilters - The filter type
 * @template TResponse - The API response type
 * @template TPageParam - The pagination parameter type
 */
export function useInfiniteData<
	TItem,
	TFilters extends Record<string, unknown> = Record<string, unknown>,
	TResponse = unknown,
	TPageParam = number,
>({
	queryKey,
	adapter,
	fetcher,
	filters,
	staleTime = 1000 * 60 * 5, // 5 minutes default
	enabled = true,
}: {
	queryKey: readonly unknown[];
	adapter: DataAdapter<TItem, TFilters, TResponse, TPageParam>;
	fetcher: Fetcher;
	filters: TFilters;
	staleTime?: number;
	enabled?: boolean;
}) {
	return useInfiniteQuery({
		queryKey,
		queryFn: async ({ pageParam }) => {
			const url = adapter.buildURL(filters, pageParam as TPageParam);
			const response = await fetcher<TResponse>(url);
			return adapter.parseResponse(response);
		},
		initialPageParam: adapter.initialPageParam,
		getNextPageParam: (lastPage, allPages) => adapter.getNextPageParam(lastPage, allPages),
		staleTime,
		enabled,
		select: (data) => ({
			pages: data.pages,
			pageParams: data.pageParams,
			items: data.pages.flatMap((page) => page.items),
			total: data.pages[data.pages.length - 1]?.total || 0,
			hasNextPage: data.pages[data.pages.length - 1]?.hasNextPage || false,
		}),
	});
}

/**
 * Hook for prefetching next page
 */
export function usePrefetchNextPage<
	TItem,
	TFilters extends Record<string, unknown> = Record<string, unknown>,
	TResponse = unknown,
	TPageParam = number,
>({
	queryKey,
	adapter,
	fetcher,
}: {
	queryKey: readonly unknown[];
	adapter: DataAdapter<TItem, TFilters, TResponse, TPageParam>;
	fetcher: Fetcher;
}) {
	const queryClient = useQueryClient();

	return (filters: TFilters, currentPage: number) => {
		queryClient.prefetchInfiniteQuery({
			queryKey,
			queryFn: async ({ pageParam }) => {
				const url = adapter.buildURL(filters, pageParam as TPageParam);
				const response = await fetcher<TResponse>(url);
				return adapter.parseResponse(response);
			},
			initialPageParam: adapter.initialPageParam,
			getNextPageParam: (lastPage, allPages) => adapter.getNextPageParam(lastPage, allPages),
			pages: currentPage + 1,
		});
	};
}
