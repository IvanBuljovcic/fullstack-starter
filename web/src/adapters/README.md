# Data Adapters

This directory contains adapters that make data fetching API-agnostic. Adapters implement the `DataAdapter` interface to translate between your app's internal data model and external API contracts.

## Table of Contents

- [What is a Data Adapter?](#what-is-a-data-adapter)
- [Why Use Adapters?](#why-use-adapters)
- [The DataAdapter Interface](#the-dataadapter-interface)
- [Creating a New Adapter](#creating-a-new-adapter)
- [Examples](#examples)
  - [Skip-Based Pagination](#example-1-skip-based-pagination-dummyjson)
  - [Page-Based Pagination](#example-2-page-based-pagination)
  - [Cursor-Based Pagination](#example-3-cursor-based-pagination)
  - [GraphQL API](#example-4-graphql-api)
- [Testing Adapters](#testing-adapters)
- [Best Practices](#best-practices)

---

## What is a Data Adapter?

A **Data Adapter** is a class that implements the `DataAdapter<TItem, TFilters, TResponse, TPageParam>` interface. It handles:

1. **URL Building** - Construct API endpoint URLs from filters and pagination params
2. **Response Parsing** - Transform API responses into a standardized format
3. **Pagination Logic** - Calculate next page parameters
4. **Type Safety** - Ensure correct types throughout the data flow

```typescript
// Your app always uses the same internal model
const filters = { search: "phone", category: "smartphones" };

// The adapter translates to API-specific format
DummyJSONAdapter → GET /products/search?q=phone&limit=20&skip=0
CustomAPIAdapter → GET /api/products?search=phone&category=smartphones&page=1
```

---

## Why Use Adapters?

### ❌ Without Adapters (Tightly Coupled)

```typescript
// Hard-coded to one API
async function fetchProducts(filters: Filters, page: number) {
  const url = `/api/products?page=${page}&search=${filters.search}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.products;
}

// To change APIs → Rewrite everything 😢
```

### ✅ With Adapters (Loosely Coupled)

```typescript
// Works with ANY API via adapters
const adapter = new DummyJSONAdapter(); // Or CustomAPIAdapter, or GitHubAdapter, etc.

const { data } = useInfiniteData({
  adapter,
  filters,
  fetcher,
});

// To change APIs → Swap adapter 🎉
```

**Benefits:**
- 🔄 **Swap APIs** without touching application code
- 🧪 **Test easily** with mock adapters
- 📦 **Reusable** across different data sources
- 🛡️ **Type-safe** with full TypeScript support
- 🧹 **Clean** separation of concerns

---

## The DataAdapter Interface

```typescript
interface DataAdapter<
  TItem,                    // Item type (Product, User, Post, etc.)
  TFilters = Record<string, unknown>,  // Filter type
  TResponse = unknown,      // Raw API response type
  TPageParam = number       // Pagination param type (number, string, object)
> {
  /**
   * The initial pagination parameter
   * Examples: 0 (skip-based), 1 (page-based), null (cursor-based)
   */
  initialPageParam: TPageParam;

  /**
   * Build the URL for fetching data
   * @param filters - Your internal filter object
   * @param pageParam - Pagination parameter (skip, page, cursor, etc.)
   * @returns Relative URL path (without base URL)
   */
  buildURL(filters: TFilters, pageParam: TPageParam): string;

  /**
   * Parse the raw API response into standardized format
   * @param response - Raw API response
   * @returns Standardized object with items, total, hasNextPage
   */
  parseResponse(response: TResponse): {
    items: TItem[];
    total: number;
    hasNextPage: boolean;
  };

  /**
   * Calculate the next page parameter
   * @param lastPage - Last page's parsed response
   * @param allPages - All pages fetched so far
   * @returns Next page parameter, or undefined if no more pages
   */
  getNextPageParam(
    lastPage: ReturnType<this["parseResponse"]>,
    allPages: ReturnType<this["parseResponse"]>[]
  ): TPageParam | undefined;
}
```

---

## Creating a New Adapter

### Step 1: Define Types

```typescript
// Your internal filter model (consistent across adapters)
type InternalFilters = {
  search?: string;
  category?: string;
};

// The item type
type Product = {
  id: number;
  title: string;
  price: number;
  // ...
};

// The API response structure
type APIResponse = {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    hasMore: boolean;
  };
};
```

### Step 2: Implement the Adapter

```typescript
import type { DataAdapter } from "./data-adapter";

export class MyAPIAdapter
  implements DataAdapter<Product, InternalFilters, APIResponse, number>
{
  // Step 1: Set initial page param
  initialPageParam = 1; // Page-based starts at 1

  // Step 2: Build URL from filters and pagination
  buildURL(filters: InternalFilters, page: number): string {
    const params = new URLSearchParams();
    params.set("page", page.toString());

    if (filters.search) {
      params.set("q", filters.search); // Translate: search → q
    }

    if (filters.category) {
      params.set("category", filters.category);
    }

    return `/api/products?${params.toString()}`;
  }

  // Step 3: Parse response to standardized format
  parseResponse(response: APIResponse) {
    return {
      items: response.data,
      total: response.pagination.total,
      hasNextPage: response.pagination.hasMore,
    };
  }

  // Step 4: Calculate next page parameter
  getNextPageParam(
    lastPage: ReturnType<this["parseResponse"]>,
    allPages: ReturnType<this["parseResponse"]>[]
  ) {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }
}
```

### Step 3: Use the Adapter

```typescript
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { fetcher } from "@/lib/api-client";
import { MyAPIAdapter } from "@/adapters/my-api-adapter";

const adapter = new MyAPIAdapter();

function MyComponent() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteData({
    queryKey: ["products"],
    adapter,
    fetcher,
    filters: { search: "laptop" },
  });

  return (
    <div>
      {data?.items.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
      {hasNextPage && <button onClick={() => fetchNextPage()}>Load More</button>}
    </div>
  );
}
```

---

## Examples

### Example 1: Skip-Based Pagination (DummyJSON)

**API Characteristics:**
- Uses `limit` and `skip` parameters
- First page: `skip=0`, second page: `skip=20`, etc.
- Different endpoints for search vs category

```typescript
import type { DataAdapter } from "./data-adapter";

type DummyJSONFilters = {
  search?: string;
  category?: string;
};

type DummyJSONProduct = {
  id: number;
  title: string;
  price: number;
  rating: number;
  // ...
};

type DummyJSONResponse = {
  products: DummyJSONProduct[];
  total: number;
  skip: number;
  limit: number;
};

export class DummyJSONProductAdapter
  implements DataAdapter<DummyJSONProduct, DummyJSONFilters, DummyJSONResponse, number>
{
  private readonly limit: number;

  constructor(limit = 20) {
    this.limit = limit;
  }

  initialPageParam = 0; // Skip starts at 0

  buildURL(filters: DummyJSONFilters, skip: number): string {
    const params = new URLSearchParams();
    params.set("limit", this.limit.toString());
    params.set("skip", skip.toString());

    // Different endpoints based on filters
    if (filters.search) {
      params.set("q", filters.search);
      return `/products/search?${params.toString()}`;
    }

    if (filters.category) {
      return `/products/category/${filters.category}?${params.toString()}`;
    }

    return `/products?${params.toString()}`;
  }

  parseResponse(response: DummyJSONResponse) {
    return {
      items: response.products,
      total: response.total,
      hasNextPage: response.skip + response.limit < response.total,
    };
  }

  getNextPageParam(_lastPage: ReturnType<this["parseResponse"]>, allPages: ReturnType<this["parseResponse"]>[]) {
    const nextSkip = allPages.length * this.limit;
    return nextSkip < _lastPage.total ? nextSkip : undefined;
  }
}

// Usage
const adapter = new DummyJSONProductAdapter(30); // 30 items per page
```

---

### Example 2: Page-Based Pagination

**API Characteristics:**
- Uses `page` parameter (1, 2, 3, etc.)
- Returns `hasNextPage` or total pages
- Nested response structure

```typescript
type PageBasedFilters = {
  search?: string;
  status?: string;
};

type PageBasedItem = {
  id: string;
  name: string;
};

type PageBasedResponse = {
  data: {
    items: PageBasedItem[];
    meta: {
      currentPage: number;
      totalPages: number;
      total: number;
    };
  };
};

export class PageBasedAdapter
  implements DataAdapter<PageBasedItem, PageBasedFilters, PageBasedResponse, number>
{
  private readonly perPage: number;

  constructor(perPage = 25) {
    this.perPage = perPage;
  }

  initialPageParam = 1; // Page starts at 1

  buildURL(filters: PageBasedFilters, page: number): string {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("per_page", this.perPage.toString());

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.status) {
      params.set("status", filters.status);
    }

    return `/api/items?${params.toString()}`;
  }

  parseResponse(response: PageBasedResponse) {
    const { items, meta } = response.data;
    return {
      items,
      total: meta.total,
      hasNextPage: meta.currentPage < meta.totalPages,
    };
  }

  getNextPageParam(lastPage: ReturnType<this["parseResponse"]>, allPages: ReturnType<this["parseResponse"]>[]) {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }
}
```

---

### Example 3: Cursor-Based Pagination

**API Characteristics:**
- Uses cursor tokens instead of page numbers
- Each page returns a `nextCursor` for the next request
- Common in real-time feeds (Twitter, Instagram, etc.)

```typescript
type CursorFilters = {
  userId?: string;
  search?: string;
};

type Post = {
  id: string;
  content: string;
  createdAt: string;
};

type CursorResponse = {
  posts: Post[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
};

type CursorPageParam = string | null; // Cursor is a string

export class CursorBasedAdapter
  implements DataAdapter<Post, CursorFilters, CursorResponse, CursorPageParam>
{
  private readonly limit: number;

  constructor(limit = 20) {
    this.limit = limit;
  }

  initialPageParam = null; // No cursor for first page

  buildURL(filters: CursorFilters, cursor: CursorPageParam): string {
    const params = new URLSearchParams();
    params.set("limit", this.limit.toString());

    if (cursor) {
      params.set("cursor", cursor); // Only add cursor if not first page
    }

    if (filters.userId) {
      params.set("user_id", filters.userId);
    }

    if (filters.search) {
      params.set("q", filters.search);
    }

    return `/api/posts?${params.toString()}`;
  }

  parseResponse(response: CursorResponse) {
    return {
      items: response.posts,
      total: response.posts.length, // Cursor-based often doesn't have total
      hasNextPage: response.pagination.hasMore,
    };
  }

  getNextPageParam(lastPage: ReturnType<this["parseResponse"]>, _allPages: ReturnType<this["parseResponse"]>[]) {
    // Return the cursor for the next page, or undefined if no more pages
    const lastItem = lastPage.items[lastPage.items.length - 1];
    return lastPage.hasNextPage && lastItem ? lastItem.id : undefined;
  }
}
```

---

### Example 4: GraphQL API

**API Characteristics:**
- Uses GraphQL queries instead of REST
- Cursor-based pagination with edges/nodes structure
- Different URL building approach

```typescript
type GraphQLFilters = {
  category?: string;
  minPrice?: number;
};

type GraphQLProduct = {
  id: string;
  name: string;
  price: number;
};

type GraphQLResponse = {
  data: {
    products: {
      edges: Array<{
        node: GraphQLProduct;
        cursor: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
      totalCount: number;
    };
  };
};

type GraphQLCursor = string | null;

export class GraphQLProductAdapter
  implements DataAdapter<GraphQLProduct, GraphQLFilters, GraphQLResponse, GraphQLCursor>
{
  private readonly first: number;

  constructor(first = 20) {
    this.first = first;
  }

  initialPageParam = null;

  buildURL(filters: GraphQLFilters, cursor: GraphQLCursor): string {
    // For GraphQL, you might build a query string or return a fixed endpoint
    // The actual query would be in the request body
    return `/graphql`;
  }

  // Note: For GraphQL, you'd typically override the fetcher to send POST with query
  buildQuery(filters: GraphQLFilters, cursor: GraphQLCursor): string {
    const cursorArg = cursor ? `, after: "${cursor}"` : "";
    const categoryFilter = filters.category ? `, category: "${filters.category}"` : "";
    const priceFilter = filters.minPrice ? `, minPrice: ${filters.minPrice}` : "";

    return `
      query {
        products(first: ${this.first}${cursorArg}${categoryFilter}${priceFilter}) {
          edges {
            node {
              id
              name
              price
            }
            cursor
          }
          pageInfo {
            hasNextPage
            endCursor
          }
          totalCount
        }
      }
    `;
  }

  parseResponse(response: GraphQLResponse) {
    const { edges, pageInfo, totalCount } = response.data.products;
    return {
      items: edges.map((edge) => edge.node),
      total: totalCount,
      hasNextPage: pageInfo.hasNextPage,
    };
  }

  getNextPageParam(lastPage: ReturnType<this["parseResponse"]>, _allPages: ReturnType<this["parseResponse"]>[]) {
    // Extract cursor from the last edge
    if (!lastPage.hasNextPage) return undefined;

    // You'd need to store the cursor separately or get it from response
    // This is a simplified example
    const lastItem = lastPage.items[lastPage.items.length - 1];
    return lastItem ? lastItem.id : undefined;
  }
}
```

---

## Testing Adapters

### Unit Testing with Jest

```typescript
import { DummyJSONProductAdapter } from "./dummyjson-product-adapter";

describe("DummyJSONProductAdapter", () => {
  const adapter = new DummyJSONProductAdapter(20);

  describe("buildURL", () => {
    it("builds search URL correctly", () => {
      const url = adapter.buildURL({ search: "phone" }, 0);
      expect(url).toBe("/products/search?limit=20&skip=0&q=phone");
    });

    it("builds category URL correctly", () => {
      const url = adapter.buildURL({ category: "smartphones" }, 20);
      expect(url).toBe("/products/category/smartphones?limit=20&skip=20");
    });

    it("builds default URL for no filters", () => {
      const url = adapter.buildURL({}, 0);
      expect(url).toBe("/products?limit=20&skip=0");
    });
  });

  describe("parseResponse", () => {
    it("parses response correctly", () => {
      const apiResponse = {
        products: [{ id: 1, title: "iPhone" }],
        total: 194,
        skip: 0,
        limit: 20,
      };

      const parsed = adapter.parseResponse(apiResponse);

      expect(parsed).toEqual({
        items: [{ id: 1, title: "iPhone" }],
        total: 194,
        hasNextPage: true, // 0 + 20 < 194
      });
    });

    it("detects last page", () => {
      const apiResponse = {
        products: [{ id: 190, title: "Last Product" }],
        total: 194,
        skip: 180,
        limit: 20,
      };

      const parsed = adapter.parseResponse(apiResponse);

      expect(parsed.hasNextPage).toBe(false); // 180 + 20 >= 194
    });
  });

  describe("getNextPageParam", () => {
    it("calculates next skip correctly", () => {
      const mockPages = [
        { items: [], total: 100, hasNextPage: true },
        { items: [], total: 100, hasNextPage: true },
      ];

      const nextSkip = adapter.getNextPageParam(mockPages[1], mockPages);

      expect(nextSkip).toBe(40); // 2 pages * 20 items per page
    });

    it("returns undefined when no more pages", () => {
      const mockPages = [
        { items: [], total: 20, hasNextPage: false },
      ];

      const nextSkip = adapter.getNextPageParam(mockPages[0], mockPages);

      expect(nextSkip).toBeUndefined();
    });
  });
});
```

### Mock Adapter for Testing Components

```typescript
import type { DataAdapter } from "./data-adapter";

export class MockAdapter<TItem>
  implements DataAdapter<TItem, any, any, number>
{
  constructor(
    private mockData: TItem[],
    private itemsPerPage = 10
  ) {}

  initialPageParam = 1;

  buildURL(_filters: any, page: number): string {
    return `/mock?page=${page}`;
  }

  parseResponse(_response: any) {
    const start = (this.mockData.length - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const items = this.mockData.slice(start, end);

    return {
      items,
      total: this.mockData.length,
      hasNextPage: end < this.mockData.length,
    };
  }

  getNextPageParam(lastPage: ReturnType<this["parseResponse"]>, allPages: ReturnType<this["parseResponse"]>[]) {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }
}

// Usage in tests
const mockProducts = [
  { id: 1, title: "Product 1" },
  { id: 2, title: "Product 2" },
  { id: 3, title: "Product 3" },
];

const mockAdapter = new MockAdapter(mockProducts, 2);

const { result } = renderHook(() =>
  useInfiniteData({
    queryKey: ["test"],
    adapter: mockAdapter,
    fetcher: jest.fn(),
    filters: {},
  })
);
```

---

## Best Practices

### 1. Keep Filters Generic

✅ **Good - Generic filter model:**
```typescript
type InternalFilters = {
  search?: string;
  category?: string;
  status?: string;
};
```

❌ **Bad - API-specific filters:**
```typescript
type DummyJSONFilters = {
  q?: string; // API-specific param name
  skip?: number; // Pagination, not a filter
};
```

### 2. Handle Empty States

```typescript
parseResponse(response: APIResponse) {
  return {
    items: response.data || [], // ✅ Handle missing data
    total: response.total ?? 0,  // ✅ Handle undefined
    hasNextPage: response.hasMore ?? false,
  };
}
```

### 3. Make Adapters Configurable

```typescript
export class FlexibleAdapter implements DataAdapter<Item, Filters, Response, number> {
  constructor(
    private config: {
      limit?: number;
      endpoint?: string;
      paramMapping?: Record<string, string>;
    } = {}
  ) {}

  buildURL(filters: Filters, page: number): string {
    const limit = this.config.limit ?? 20;
    const endpoint = this.config.endpoint ?? "/api/items";

    // Use param mapping to translate filter keys
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      const mappedKey = this.config.paramMapping?.[key] ?? key;
      if (value) params.set(mappedKey, String(value));
    });

    return `${endpoint}?page=${page}&limit=${limit}&${params.toString()}`;
  }
}

// Usage
const adapter = new FlexibleAdapter({
  limit: 30,
  endpoint: "/v2/products",
  paramMapping: { search: "q", category: "cat" }, // search → q, category → cat
});
```

### 4. Document API Requirements

```typescript
/**
 * Adapter for GitHub Issues API
 *
 * API Documentation: https://docs.github.com/en/rest/issues
 *
 * Requirements:
 * - Authentication: Personal access token required
 * - Rate Limits: 5000 requests/hour for authenticated users
 * - Pagination: Uses Link headers, but we use page/per_page params
 *
 * Example Request:
 * GET /repos/facebook/react/issues?page=1&per_page=30&state=open
 *
 * Example Response:
 * [
 *   { id: 1, title: "Bug report", state: "open", ... }
 * ]
 */
export class GitHubIssuesAdapter implements DataAdapter<...> {
  // ...
}
```

### 5. Type Safety First

```typescript
// ✅ Strongly typed
type APIResponse = {
  data: {
    products: Product[];
  };
  meta: {
    total: number;
  };
};

parseResponse(response: APIResponse) {
  return {
    items: response.data.products, // TypeScript validates this path
    total: response.meta.total,
    hasNextPage: // ...
  };
}

// ❌ Loose typing
parseResponse(response: any) {
  return {
    items: response.data?.products ?? [], // No type checking
    total: response.meta?.total ?? 0,
    hasNextPage: // ...
  };
}
```

---

## Summary

**Data Adapters provide:**
- 🔌 **Plug-and-play** API integration
- 🔄 **Easy switching** between data sources
- 🧪 **Simple testing** with mock adapters
- 🛡️ **Type safety** throughout your app
- 🧹 **Clean architecture** with separation of concerns

**To add a new API:**
1. Create a new adapter class
2. Implement the 4 methods: `buildURL`, `parseResponse`, `getNextPageParam`, and set `initialPageParam`
3. Pass it to `useInfiniteData`
4. Done!

Your application code remains unchanged when switching between APIs. Just swap the adapter.
