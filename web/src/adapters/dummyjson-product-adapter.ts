import type { DataAdapter } from "./data-adapter";

export type InternalProductFilters = {
	search?: string;
	category?: string;
};

export type Product = {
	id: number;
	title: string;
	description: string;
	price: number;
	rating: number;
	category: string;
	thumbnail?: string;
	images?: string[];
	tags?: string[];
	brand?: string;
	stock?: number;
	discountPercentage?: number;
};

export type ProductsResponse = {
	products: Product[];
	total: number;
	skip: number;
	limit: number;
};

export class DummyJSONProductAdapter implements DataAdapter<Product, InternalProductFilters, ProductsResponse, number> {
	private readonly limit: number;

	constructor(limit = 20) {
		this.limit = limit;
	}

	initialPageParam = 0; // First skip value

	buildURL(filters: InternalProductFilters, skip: number): string {
		const params = new URLSearchParams();
		params.set("limit", this.limit.toString());
		params.set("skip", skip.toString());

		// Determine endpoint based on filters
		if (filters.search) {
			// Search endpoint: /products/search?q=...&limit=...&skip=...
			params.set("q", filters.search);
			return `/products/search?${params.toString()}`;
		}

		if (filters.category) {
			// Category endpoint: /products/category/{slug}?limit=...&skip=...
			return `/products/category/${filters.category}?${params.toString()}`;
		}

		// Default list endpoint: /products?limit=...&skip=...
		return `/products?${params.toString()}`;
	}

	parseResponse(response: ProductsResponse) {
		return {
			items: response.products,
			total: response.total,
			hasNextPage: response.skip + response.limit < response.total,
		};
	}

	getNextPageParam(lastPage: ReturnType<this["parseResponse"]>, allPages: ReturnType<this["parseResponse"]>[]) {
		const nextSkip = allPages.length * this.limit;
		return nextSkip < lastPage.total ? nextSkip : undefined;
	}
}
