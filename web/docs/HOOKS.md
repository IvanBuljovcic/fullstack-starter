# Custom Hooks Guide

This template includes 15+ production-ready custom hooks that handle common patterns like infinite scroll, debouncing, keyboard navigation, and more.

---

## Table of Contents

- [Data Fetching Hooks](#data-fetching-hooks)
  - [useInfiniteData](#useinfinitedata)
  - [useInfiniteScroll](#useinfinitescroll)
  - [usePrefetch](#useprefetch)
- [Performance Hooks](#performance-hooks)
  - [useDebounce](#usedebounce)
  - [useThrottle](#usethrottle)
- [Navigation Hooks](#navigation-hooks)
  - [useKeyboardNavigation](#usekeyboardnavigation)
  - [useGridNavigation](#usegridnavigation)
- [State Hooks](#state-hooks)
  - [useLocalStorage](#uselocalstorage)
  - [useFilterParams](#usefilterparams)
- [Utility Hooks](#utility-hooks)
  - [useFetch](#usefetch)
  - [useTypewriter](#usetypewriter)
- [Best Practices](#best-practices)

---

## Data Fetching Hooks

### useInfiniteData

**API-agnostic infinite scroll with TanStack Query.**

**Location:** `src/hooks/use-infinite-data.ts`

**Purpose:** Abstract infinite data fetching using the adapter pattern. Works with any API.

#### Usage

```tsx
import { useInfiniteData } from '@/hooks/use-infinite-data';
import { MyAPIAdapter } from '@/adapters/my-api-adapter';
import { fetcher } from '@/lib/api-client';

function ProductList() {
  const adapter = new MyAPIAdapter(20);
  const [filters, setFilters] = useState({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteData({
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
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}

      {isFetching && !isFetchingNextPage && <Loader />}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
```

#### Parameters

```typescript
{
  queryKey: QueryKey;              // TanStack Query key
  adapter: DataAdapter<...>;       // Data adapter
  fetcher: typeof fetcher;         // HTTP client function
  filters: TFilters;               // Filter parameters
  staleTime?: number;              // Cache duration (default: 60000ms)
  gcTime?: number;                 // Garbage collection time (default: 600000ms)
}
```

#### Return Value

```typescript
{
  data: InfiniteData<ParsedPage<T>> | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  refetch: () => void;
}
```

#### When to Use

- ✅ Building infinite scroll lists
- ✅ Load more pagination
- ✅ Need to switch between different APIs
- ✅ Want automatic caching and deduplication
- ❌ Simple one-time data fetch (use `useQuery` instead)

---

### useInfiniteScroll

**Automatic infinite scroll with IntersectionObserver.**

**Location:** `src/hooks/infinite-scroll/use-infinite-scroll.ts`

**Purpose:** Combines `useInfiniteData` with IntersectionObserver for automatic loading when user scrolls near the bottom.

#### Usage

```tsx
import { useInfiniteScroll } from '@/hooks/infinite-scroll/use-infinite-scroll';

function ProductGrid() {
  const adapter = new MyAPIAdapter(20);

  const { data, targetRef, isFetching, error } = useInfiniteScroll({
    queryKey: ['products'],
    adapter,
    fetcher,
    filters: {},
    rootMargin: '200px', // Start loading 200px before bottom
  });

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Trigger element for intersection observer */}
      <div ref={targetRef} className={styles.trigger} />

      {isFetching && <Loader />}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
```

#### Parameters

```typescript
{
  queryKey: QueryKey;
  adapter: DataAdapter<...>;
  fetcher: typeof fetcher;
  filters: TFilters;
  rootMargin?: string;          // When to trigger (default: '100px')
  threshold?: number;           // Intersection threshold (default: 0.1)
  staleTime?: number;
  gcTime?: number;
}
```

#### Return Value

```typescript
{
  data: InfiniteData<ParsedPage<T>> | undefined;
  targetRef: RefObject<HTMLDivElement>; // Attach to trigger element
  isFetching: boolean;
  error: Error | null;
}
```

#### When to Use

- ✅ Infinite scroll UX (like Twitter/Instagram feed)
- ✅ Want automatic loading without "Load More" button
- ✅ Large lists that load as user scrolls
- ❌ Need manual control over fetching (use `useInfiniteData` instead)

---

### usePrefetch

**Prefetch data for faster navigation.**

**Location:** `src/hooks/infinite-scroll/use-prefetch.ts`

**Purpose:** Preload data before user needs it (e.g., on hover, during idle time).

#### Usage

```tsx
import { usePrefetch } from '@/hooks/infinite-scroll/use-prefetch';

function ProductCard({ product }) {
  const prefetchProduct = usePrefetch<Product>({
    fetcher,
  });

  return (
    <div
      onMouseEnter={() => {
        // Prefetch product details on hover
        prefetchProduct(['product', product.id], `/products/${product.id}`);
      }}
    >
      <h3>{product.title}</h3>
      <Link href={`/products/${product.id}`}>View Details</Link>
    </div>
  );
}
```

#### Parameters

```typescript
{
  fetcher: typeof fetcher;      // HTTP client function
  staleTime?: number;           // Cache duration
}
```

#### Return Value

```typescript
(queryKey: QueryKey, url: string) => Promise<void>;
```

#### When to Use

- ✅ Anticipatory loading (hover states)
- ✅ Prefetch next page in pagination
- ✅ Preload route data before navigation
- ❌ Critical data that must be fetched immediately

---

## Performance Hooks

### useDebounce

**Debounce rapidly changing values.**

**Location:** `src/hooks/use-debounce.ts`

**Purpose:** Delay updating a value until after user stops typing. Essential for search inputs to reduce API calls.

#### Usage

```tsx
import { useDebounce } from '@/hooks/use-debounce';
import { useState } from 'react';

function SearchBar() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Only triggers API call 300ms after user stops typing
  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```

#### Parameters

```typescript
value: T; // Value to debounce
delay: number; // Delay in milliseconds (default: 500)
```

#### Return Value

```typescript
T; // Debounced value
```

#### When to Use

- ✅ Search inputs
- ✅ Form validation
- ✅ API calls triggered by user input
- ✅ Expensive calculations
- ❌ Immediate feedback needed (use controlled input)

#### Example: Search with Loading State

```tsx
function SearchWithFeedback() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const isSearching = search !== debouncedSearch;

  const { data, isFetching } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  return (
    <div>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} />
      {isSearching && <span>Typing...</span>}
      {isFetching && <Loader />}
      {data && <SearchResults results={data} />}
    </div>
  );
}
```

---

### useThrottle

**Throttle rapidly firing events.**

**Location:** `src/hooks/use-throttle.ts`

**Purpose:** Limit how often a value updates. Unlike debounce (which waits), throttle ensures updates happen at regular intervals.

#### Usage

```tsx
import { useThrottle } from '@/hooks/use-throttle';
import { useState, useEffect } from 'react';

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updates at most once every 100ms
  console.log('Scroll position:', throttledScrollY);

  return <div>Scrolled: {throttledScrollY}px</div>;
}
```

#### Parameters

```typescript
value: T; // Value to throttle
delay: number; // Minimum interval in milliseconds
```

#### Return Value

```typescript
T; // Throttled value
```

#### When to Use

- ✅ Scroll events
- ✅ Resize events
- ✅ Mouse move tracking
- ✅ Animation frames
- ❌ User input (use debounce instead)

#### Debounce vs Throttle

```
User types: a-b-c-d-e-f-g (300ms between each)

Debounce (500ms): -------g  (only fires after typing stops)
Throttle (500ms): a---d---g  (fires every 500ms while typing)
```

---

## Navigation Hooks

### useKeyboardNavigation

**Keyboard interaction with focus management.**

**Location:** `src/hooks/keyboard-navigation/use-keyboard-navigation.ts`

**Purpose:** Handle keyboard events (Escape, Tab, Enter) with focus trapping and restoration.

#### Usage

```tsx
import { useKeyboardNavigation } from '@/hooks/keyboard-navigation/use-keyboard-navigation';
import { useRef } from 'react';

function Modal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation({
    containerRef: modalRef,
    isActive: isOpen,
    onEscape: onClose,
    trapFocus: true,
    restoreFocus: true,
  });

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className={styles.modal}>
      <h2>Modal Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

#### Parameters

```typescript
{
  containerRef: RefObject<HTMLElement>;  // Container element
  isActive?: boolean;                    // Enable/disable hook
  onEscape?: () => void;                 // Escape key handler
  onEnter?: () => void;                  // Enter key handler
  trapFocus?: boolean;                   // Trap focus inside container
  restoreFocus?: boolean;                // Restore focus on unmount
}
```

#### Return Value

```typescript
void
```

#### When to Use

- ✅ Modals and dialogs
- ✅ Dropdown menus
- ✅ Custom select components
- ✅ Sidebar panels
- ❌ Simple buttons (use native elements)

---

### useGridNavigation

**Grid keyboard navigation with arrow keys.**

**Location:** `src/hooks/keyboard-navigation/use-grid-navigation.ts`

**Purpose:** Navigate grid layouts with arrow keys (like a calendar or image gallery).

#### Usage

```tsx
import { useGridNavigation } from '@/hooks/keyboard-navigation/use-grid-navigation';
import { useRef } from 'react';

function ProductGrid({ products }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGridNavigation({
    containerRef: gridRef,
    columns: 3,
    onEnter: (index) => {
      // Navigate to product details
      window.location.href = `/products/${products[index].id}`;
    },
  });

  return (
    <div ref={gridRef} className={styles.grid}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          tabIndex={index === 0 ? 0 : -1}
        />
      ))}
    </div>
  );
}
```

#### Parameters

```typescript
{
  containerRef: RefObject<HTMLElement>;
  columns: number;                       // Number of columns in grid
  onEnter?: (index: number) => void;     // Enter key on item
  isActive?: boolean;
}
```

#### Return Value

```typescript
void
```

#### When to Use

- ✅ Image galleries
- ✅ Product grids
- ✅ Calendar views
- ✅ Card layouts
- ❌ Single-column lists (use standard Tab navigation)

---

## State Hooks

### useLocalStorage

**Persistent state in localStorage.**

**Location:** `src/hooks/use-local-storage.ts`

**Purpose:** Sync React state with localStorage for persistence across sessions.

#### Usage

```tsx
import { useLocalStorage } from '@/hooks/use-local-storage';

function ThemeSettings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <Select
      label="Theme"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
    />
  );
}
```

#### Parameters

```typescript
key: string; // localStorage key
initialValue: T; // Default value
```

#### Return Value

```typescript
[T, (value: T | ((val: T) => T)) => void]  // Like useState
```

#### When to Use

- ✅ User preferences (theme, language)
- ✅ Draft content (form data)
- ✅ UI state (sidebar collapsed)
- ❌ Sensitive data (use secure storage)
- ❌ Large data (use IndexedDB instead)

#### Example: Form Draft Recovery

```tsx
function ContactForm() {
  const [draft, setDraft] = useLocalStorage('contact-draft', {
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async () => {
    await submitForm(draft);
    setDraft({ name: '', email: '', message: '' }); // Clear draft
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
      />
      {/* More fields */}
    </form>
  );
}
```

---

### useFilterParams

**URL parameter management for filters.**

**Location:** `src/hooks/use-filter-params.ts`

**Purpose:** Sync filter state with URL query parameters for shareable URLs.

#### Usage

```tsx
import { useFilterParams } from '@/hooks/use-filter-params';

function ProductFilters() {
  const { filters, setFilter, clearFilters } = useFilterParams({
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  return (
    <div>
      <Select
        value={filters.category}
        onChange={(e) => setFilter('category', e.target.value)}
        options={categories}
      />

      <Input
        type="number"
        value={filters.minPrice}
        onChange={(e) => setFilter('minPrice', e.target.value)}
      />

      <button onClick={clearFilters}>Clear All</button>
    </div>
  );
}
```

#### Parameters

```typescript
initialFilters: Record<string, string>; // Default filter values
```

#### Return Value

```typescript
{
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}
```

#### When to Use

- ✅ Search pages with filters
- ✅ Sortable tables
- ✅ Shareable search results
- ❌ Temporary UI state (use useState)

---

## Utility Hooks

### useFetch

**Simple data fetching with loading/error states.**

**Location:** `src/hooks/use-fetch.ts`

**Purpose:** Basic fetch hook for simple GET requests.

#### Usage

```tsx
import { useFetch } from '@/hooks/use-fetch';

function UserProfile({ userId }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.name}</div>;
}
```

#### When to Use

- ✅ Simple one-time fetches
- ✅ Prototyping
- ❌ Production (use TanStack Query instead)

---

### useTypewriter

**Typewriter text animation effect.**

**Location:** `src/hooks/use-typewriter.ts`

**Purpose:** Animate text appearing character by character.

#### Usage

```tsx
import { useTypewriter } from '@/hooks/use-typewriter';

function Hero() {
  const text = useTypewriter(
    'Welcome to our platform',
    50 // Speed in ms per character
  );

  return <h1>{text}</h1>;
}
```

#### When to Use

- ✅ Landing page hero text
- ✅ Loading messages
- ✅ Tutorial steps
- ❌ Accessibility-critical text (can be disorienting)

---

## Best Practices

### 1. **Choose the Right Hook**

```tsx
// ❌ Bad: Using useEffect when hook exists
useEffect(() => {
  const timer = setTimeout(() => setDebouncedValue(value), 500);
  return () => clearTimeout(timer);
}, [value]);

// ✅ Good: Use built-in hook
const debouncedValue = useDebounce(value, 500);
```

### 2. **Combine Hooks**

```tsx
// Combine useDebounce + useInfiniteData
function SearchableProductList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data } = useInfiniteData({
    queryKey: ['products', debouncedSearch],
    adapter,
    fetcher,
    filters: { search: debouncedSearch },
  });

  // ...
}
```

### 3. **Memoize Callbacks**

```tsx
import { useCallback } from 'react';

function ProductList() {
  const handleEnter = useCallback(
    (index) => {
      navigate(`/products/${products[index].id}`);
    },
    [products]
  );

  useGridNavigation({
    containerRef,
    columns: 3,
    onEnter: handleEnter, // Stable reference
  });
}
```

### 4. **Handle Cleanup**

All hooks handle cleanup automatically, but be aware:

```tsx
function Component() {
  // ✅ Hooks clean up on unmount
  useKeyboardNavigation({ ... });
  useInfiniteScroll({ ... });

  // No manual cleanup needed!
}
```

### 5. **Test Hooks**

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '@/hooks/use-debounce';

test('debounces value', async () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'initial' } }
  );

  expect(result.current).toBe('initial');

  rerender({ value: 'updated' });
  expect(result.current).toBe('initial'); // Still old value

  await waitFor(
    () => {
      expect(result.current).toBe('updated');
    },
    { timeout: 500 }
  );
});
```

---

## Related Documentation

- [Adapter Pattern](./ADAPTERS.md) - Using adapters with data fetching hooks
- [Component Library](./COMPONENTS.md) - Using hooks in components
- [Testing Guide](./TESTING.md) - Testing custom hooks

---

## Hook Summary Table

| Hook                    | Purpose                       | Use Case             | Performance Impact |
| ----------------------- | ----------------------------- | -------------------- | ------------------ |
| `useInfiniteData`       | Infinite scroll with adapters | Product lists, feeds | Medium             |
| `useInfiniteScroll`     | Auto-loading infinite scroll  | Twitter-like feeds   | Medium             |
| `usePrefetch`           | Anticipatory loading          | Hover states         | Low                |
| `useDebounce`           | Delay value updates           | Search inputs        | Low                |
| `useThrottle`           | Limit update frequency        | Scroll tracking      | Low                |
| `useKeyboardNavigation` | Keyboard interactions         | Modals, menus        | Low                |
| `useGridNavigation`     | Grid arrow navigation         | Galleries            | Low                |
| `useLocalStorage`       | Persistent state              | Preferences          | Low                |
| `useFilterParams`       | URL filter sync               | Search pages         | Low                |
| `useFetch`              | Simple data fetching          | Basic GET requests   | Low                |
| `useTypewriter`         | Text animation                | Hero text            | Low                |
