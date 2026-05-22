# Adapter Pattern Guide

The Adapter Pattern is a core architectural feature of this template that decouples your UI components from specific API implementations. This allows you to switch between different backend APIs without changing your component code.

---

## Table of Contents

- [What is the Adapter Pattern?](#what-is-the-adapter-pattern)
- [Why Use Adapters?](#why-use-adapters)
- [DataAdapter Interface](#dataadapter-interface)
- [Creating an Adapter](#creating-an-adapter)
- [Using Adapters](#using-adapters)
- [Built-in Adapters](#built-in-adapters)
- [Real-World Examples](#real-world-examples)
- [Testing with Adapters](#testing-with-adapters)
- [Best Practices](#best-practices)

---

## What is the Adapter Pattern?

The Adapter Pattern is a structural design pattern that allows objects with incompatible interfaces to collaborate. In this template, it standardizes how we fetch and parse data from different APIs.

**Without Adapter Pattern:**

```tsx
// Tightly coupled to specific API
function ProductList() {
  const { data } = useQuery({
    queryFn: async () => {
      const response = await fetch('https://dummyjson.com/products');
      const json = await response.json();
      // Hardcoded response parsing
      return {
        items: json.products,
        total: json.total,
        hasMore: json.skip + json.limit < json.total,
      };
    },
  });
  // ...
}
```

**With Adapter Pattern:**

```tsx
// Decoupled from specific API
function ProductList() {
  const adapter = new DummyJSONProductAdapter(20);
  // Works with ANY adapter that implements DataAdapter
  const { data } = useInfiniteData({
    queryKey: ['products'],
    adapter,
    fetcher,
  });
  // ...
}
```

---

## Why Use Adapters?

### 1. **API Portability**

Switch between different APIs without refactoring components:

```tsx
// Development: Use mock API
const adapter = new DummyJSONProductAdapter(20);

// Production: Switch to real backend
const adapter = new CustomBackendProductAdapter(20);

// Component code stays exactly the same!
```

### 2. **Consistent Data Format**

Different APIs return data in different formats. Adapters normalize them:

```typescript
// DummyJSON returns: { products: [], total: 0, skip: 0 }
// Your backend returns: { data: [], count: 0, page: 1 }
// Both normalized to: { items: [], total: 0, hasNextPage: boolean }
```

### 3. **Testability**

Create mock adapters for testing without hitting real APIs:

```typescript
class MockProductAdapter implements DataAdapter<Product, any, any, number> {
  buildURL() {
    return '/mock';
  }
  parseResponse() {
    return { items: mockData, total: 10, hasNextPage: false };
  }
  // ...
}
```

### 4. **Type Safety**

Adapters are fully typed, providing autocomplete and error checking:

```typescript
DataAdapter<
  Product, // Item type
  ProductFilters, // Filter type
  APIResponse, // API response type
  number // Page parameter type
>;
```

### 5. **Separation of Concerns**

- **Components**: Focus on UI and user interactions
- **Adapters**: Handle API-specific logic
- **Hooks**: Manage data fetching and state

---

## DataAdapter Interface

Located at `src/adapters/data-adapter.ts`:

```typescript
export interface DataAdapter<TItem, TFilters, TResponse, TPageParam> {
  /**
   * Build the URL for fetching data
   * @param filters - User-defined filters
   * @param pageParam - Current page parameter
   * @returns Complete URL string
   */
  buildURL(filters: TFilters, pageParam: TPageParam): string;

  /**
   * Parse the API response into a standard format
   * @param response - Raw API response
   * @returns Normalized data with items, total, and hasNextPage
   */
  parseResponse(response: TResponse): ParsedPage<TItem>;

  /**
   * Calculate the next page parameter
   * @param lastPage - Last fetched page
   * @param allPages - All pages fetched so far
   * @returns Next page parameter or undefined if no more pages
   */
  getNextPageParam(
    lastPage: ParsedPage<TItem>,
    allPages: ParsedPage<TItem>[]
  ): TPageParam | undefined;

  /**
   * Initial page parameter (e.g., 0, 1, null)
   */
  initialPageParam: TPageParam;
}
```

**ParsedPage Type:**

```typescript
export type ParsedPage<TItem> = {
  items: TItem[];
  total: number;
  hasNextPage: boolean;
};
```

---

## Creating an Adapter

### Step 1: Define Your Types

```typescript
// Product type
interface Product {
  id: number;
  title: string;
  price: number;
  // ... other fields
}

// Filter type
interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

// API response type (what your API actually returns)
interface MyAPIResponse {
  data: Array<{
    id: number;
    name: string; // Note: different field name
    cost: number;
  }>;
  pagination: {
    total: number;
    page: number;
    hasMore: boolean;
  };
}
```

### Step 2: Implement the Adapter

```typescript
import type { DataAdapter, ParsedPage } from './data-adapter';

export class MyAPIProductAdapter
  implements
    DataAdapter<
      Product,
      ProductFilters,
      MyAPIResponse,
      number // Using page numbers
    >
{
  constructor(private limit: number = 20) {}

  buildURL(filters: ProductFilters, pageParam: number): string {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: this.limit.toString(),
    });

    if (filters.category) {
      params.append('category', filters.category);
    }

    if (filters.search) {
      params.append('q', filters.search);
    }

    if (filters.minPrice) {
      params.append('min_price', filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      params.append('max_price', filters.maxPrice.toString());
    }

    return `/api/products?${params.toString()}`;
  }

  parseResponse(response: MyAPIResponse): ParsedPage<Product> {
    return {
      items: response.data.map((item) => ({
        id: item.id,
        title: item.name, // Map name -> title
        price: item.cost, // Map cost -> price
      })),
      total: response.pagination.total,
      hasNextPage: response.pagination.hasMore,
    };
  }

  getNextPageParam(
    lastPage: ParsedPage<Product>,
    allPages: ParsedPage<Product>[]
  ): number | undefined {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }

  initialPageParam = 1;
}
```

### Step 3: Use the Adapter

```tsx
import { useInfiniteData } from '@/hooks/use-infinite-data';
import { MyAPIProductAdapter } from '@/adapters/my-api-product-adapter';
import { fetcher } from '@/lib/api-client';

function ProductList() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const adapter = new MyAPIProductAdapter(20);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteData({
    queryKey: ['products', filters],
    adapter,
    fetcher,
    filters,
  });

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
}
```

---

## Using Adapters

### With useInfiniteData

The primary way to use adapters:

```tsx
import { useInfiniteData } from '@/hooks/use-infinite-data';

const adapter = new MyAPIProductAdapter(20);

const { data, fetchNextPage, hasNextPage, isFetching, error } = useInfiniteData(
  {
    queryKey: ['products', filters],
    adapter,
    fetcher,
    filters,
  }
);
```

### With useInfiniteScroll

Automatic infinite scroll with IntersectionObserver:

```tsx
import { useInfiniteScroll } from '@/hooks/infinite-scroll/use-infinite-scroll';

const { data, targetRef, isFetching } = useInfiniteScroll({
  queryKey: ['products', filters],
  adapter,
  fetcher,
  filters,
  rootMargin: '200px', // Start loading 200px before bottom
});

return (
  <div>
    {/* Render items */}
    <div ref={targetRef} /> {/* Trigger element */}
    {isFetching && <Loader />}
  </div>
);
```

---

## Built-in Adapters

### DummyJSONProductAdapter

Example adapter for DummyJSON API (useful for prototyping):

```typescript
const adapter = new DummyJSONProductAdapter(20);
```

**API**: `https://dummyjson.com/products`

**Features:**

- Offset-based pagination
- Search support
- Category filtering
- Price range filtering

**Source:** `src/adapters/dummyjson-product-adapter.ts`

### CustomBackendProductAdapter

Template for your own backend API:

```typescript
const adapter = new CustomBackendProductAdapter(20);
```

**Features:**

- Page-based pagination
- Configurable base URL via environment variable
- Filter support

**Source:** `src/adapters/custom-backend-product-adapter.ts`

---

## Real-World Examples

### Example 1: E-commerce Search

```typescript
// adapters/shopify-product-adapter.ts
export class ShopifyProductAdapter
  implements
    DataAdapter<
      Product,
      { query: string; collection?: string },
      ShopifyResponse,
      string // Shopify uses cursor-based pagination
    >
{
  buildURL(filters, cursor) {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.collection) params.append('collection', filters.collection);
    if (cursor) params.append('cursor', cursor);
    return `/api/shopify/products?${params}`;
  }

  parseResponse(response) {
    return {
      items: response.products.edges.map((edge) => edge.node),
      total: response.products.totalCount,
      hasNextPage: response.products.pageInfo.hasNextPage,
    };
  }

  getNextPageParam(lastPage) {
    return lastPage.hasNextPage ? lastPage.cursor : undefined;
  }

  initialPageParam = '';
}
```

### Example 2: GitHub Repository Search

```typescript
// adapters/github-repo-adapter.ts
export class GitHubRepoAdapter
  implements
    DataAdapter<
      Repository,
      { query: string; language?: string },
      GitHubSearchResponse,
      number
    >
{
  constructor(private perPage: number = 30) {}

  buildURL(filters, page) {
    let query = filters.query;
    if (filters.language) {
      query += ` language:${filters.language}`;
    }

    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      per_page: this.perPage.toString(),
    });

    return `https://api.github.com/search/repositories?${params}`;
  }

  parseResponse(response) {
    return {
      items: response.items,
      total: response.total_count,
      hasNextPage: response.items.length === this.perPage,
    };
  }

  getNextPageParam(lastPage, allPages) {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }

  initialPageParam = 1;
}
```

### Example 3: Infinite Scroll Blog Posts

```typescript
// adapters/wordpress-post-adapter.ts
export class WordPressPostAdapter
  implements
    DataAdapter<
      Post,
      { category?: number; tag?: number },
      WordPressResponse,
      number
    >
{
  constructor(private perPage: number = 10) {}

  buildURL(filters, page) {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: this.perPage.toString(),
    });

    if (filters.category) {
      params.append('categories', filters.category.toString());
    }

    if (filters.tag) {
      params.append('tags', filters.tag.toString());
    }

    return `/wp-json/wp/v2/posts?${params}`;
  }

  parseResponse(response) {
    return {
      items: response,
      total: parseInt(response.headers.get('X-WP-Total') || '0'),
      hasNextPage: response.length === this.perPage,
    };
  }

  getNextPageParam(lastPage, allPages) {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }

  initialPageParam = 1;
}
```

---

## Testing with Adapters

### Mock Adapter for Tests

```typescript
// __tests__/mocks/mock-product-adapter.ts
export class MockProductAdapter
  implements DataAdapter<Product, any, any, number>
{
  constructor(
    private mockData: Product[] = [],
    private shouldFail: boolean = false
  ) {}

  buildURL() {
    return '/mock-url';
  }

  parseResponse() {
    if (this.shouldFail) {
      throw new Error('Mock adapter error');
    }

    return {
      items: this.mockData,
      total: this.mockData.length,
      hasNextPage: false,
    };
  }

  getNextPageParam() {
    return undefined;
  }

  initialPageParam = 1;
}
```

### Testing Components with Adapters

```tsx
// __tests__/product-list.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductList } from '@/components/ProductList';
import { MockProductAdapter } from './mocks/mock-product-adapter';

describe('ProductList', () => {
  it('renders products from adapter', async () => {
    const mockProducts = [
      { id: 1, title: 'Product 1', price: 100 },
      { id: 2, title: 'Product 2', price: 200 },
    ];

    const adapter = new MockProductAdapter(mockProducts);
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList adapter={adapter} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });
});
```

---

## Best Practices

### 1. **One Adapter Per API**

Don't try to make a universal adapter. Create specific adapters for each API:

```typescript
// ✅ Good
class StripePaymentAdapter { ... }
class PayPalPaymentAdapter { ... }

// ❌ Bad
class UniversalPaymentAdapter { ... } // Too generic
```

### 2. **Keep Adapters Pure**

Adapters should only transform data, not fetch it:

```typescript
// ✅ Good
parseResponse(response) {
  return {
    items: response.data.map(normalize),
    total: response.count,
    hasNextPage: response.hasMore,
  };
}

// ❌ Bad
async parseResponse(response) {
  // Don't fetch inside adapters!
  const extra = await fetch('/extra-data');
  return { ... };
}
```

### 3. **Handle Edge Cases**

```typescript
parseResponse(response) {
  // Handle missing data gracefully
  const items = response?.data ?? [];
  const total = response?.pagination?.total ?? 0;

  return {
    items,
    total,
    hasNextPage: items.length > 0 && items.length === this.limit,
  };
}
```

### 4. **Type Everything**

Leverage TypeScript for safety:

```typescript
// Define explicit types
interface MyAPIResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
  };
}

// Use them in adapter
class MyAdapter
  implements
    DataAdapter<
      Product,
      ProductFilters,
      MyAPIResponse, // Typed!
      number
    >
{
  parseResponse(response: MyAPIResponse) {
    // TypeScript knows response structure
    return {
      items: response.data,
      total: response.meta.total,
      hasNextPage: response.data.length === this.limit,
    };
  }
}
```

### 5. **Document Your Adapters**

````typescript
/**
 * Adapter for Shopify Storefront API
 *
 * @example
 * ```ts
 * const adapter = new ShopifyAdapter(20);
 * const { data } = useInfiniteData({
 *   queryKey: ['products'],
 *   adapter,
 *   fetcher,
 * });
 * ```
 *
 * @see https://shopify.dev/docs/api/storefront
 */
export class ShopifyAdapter implements DataAdapter<...> {
  // ...
}
````

### 6. **Environment-Based Adapters**

```typescript
// lib/get-product-adapter.ts
export function getProductAdapter() {
  if (process.env.NODE_ENV === 'development') {
    return new DummyJSONProductAdapter(20);
  }
  return new CustomBackendProductAdapter(20);
}

// Usage
const adapter = getProductAdapter();
```

### 7. **Adapter Composition**

For complex scenarios, compose adapters:

```typescript
class CachedAdapter<T, F, R, P> implements DataAdapter<T, F, R, P> {
  constructor(
    private baseAdapter: DataAdapter<T, F, R, P>,
    private cache: Cache
  ) {}

  async parseResponse(response: R) {
    const parsed = this.baseAdapter.parseResponse(response);
    // Add caching logic
    await this.cache.set('key', parsed);
    return parsed;
  }

  // Delegate other methods
  buildURL = this.baseAdapter.buildURL;
  getNextPageParam = this.baseAdapter.getNextPageParam;
  initialPageParam = this.baseAdapter.initialPageParam;
}
```

---

## Related Documentation

- [Hooks Guide](./HOOKS.md) - Using adapters with custom hooks
- [Testing Guide](./TESTING.md) - Testing adapter-based components
- [API Client](./API_CLIENT.md) - HTTP client used with adapters

---

## Additional Resources

- [Adapter Pattern (Design Patterns)](https://refactoring.guru/design-patterns/adapter)
- [TanStack Query Infinite Queries](https://tanstack.com/query/latest/docs/react/guides/infinite-queries)
- [src/adapters/README.md](../src/adapters/README.md) - Local adapter documentation
