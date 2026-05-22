import type { InternalProductFilters } from "@/adapters/dummyjson-product-adapter";

export const productKeys = {
	all: ["products"] as const,
	detail: (id: string) => [...productKeys.all, "detail", id] as const,
	infinite: (filters?: InternalProductFilters) => [...productKeys.all, "infinite", filters] as const,
};

export const categoryKeys = {
	all: ["categories"] as const,
};

export const queryKeys = {
	all: ["quotes"] as const,
	single: (id: string) => [...queryKeys.all, id] as const,
};
