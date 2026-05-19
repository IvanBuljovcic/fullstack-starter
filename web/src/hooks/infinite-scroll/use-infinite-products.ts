"use client";

import { DummyJSONProductAdapter, type InternalProductFilters } from "@/adapters/dummyjson-product-adapter";
import { fetcher } from "@/lib/api-client";
import { productKeys } from "@/queries/keys";
import { useInfiniteData, usePrefetchNextPage } from "../use-infinite-data";

const productAdapter = new DummyJSONProductAdapter(20); // 20 items per page

export const useInfiniteProducts = (filters: InternalProductFilters = {}) => {
	return useInfiniteData({
		queryKey: productKeys.infinite(filters),
		adapter: productAdapter,
		fetcher,
		filters,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

export const useProductPrefetch = () => {
	return usePrefetchNextPage({
		queryKey: productKeys.infinite(),
		adapter: productAdapter,
		fetcher,
	});
};
