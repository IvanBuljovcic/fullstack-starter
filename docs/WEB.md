# Web Documentation

## Overview

The web application is built with **Next.js 16** and **React 19**, featuring a production-ready component library, comprehensive testing infrastructure, and modern development tooling. It's designed for building scalable, accessible, and performant web applications.

**Tech Stack:**
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.9** - Type safety
- **TanStack Query 5** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **Vitest 3** - Testing framework
- **Storybook 8** - Component documentation
- **Biome** - Linting and formatting

**Port:** 4200 (configurable)

---

## Project Structure

```
web/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page
│   │   └── favicon.ico             # Site favicon
│   ├── components/
│   │   ├── Accessibility/          # A11y components
│   │   │   └── Announcer/          # Screen reader announcements
│   │   ├── SmartErrorBoundary/     # Error boundary with retry
│   │   └── shared/                 # Reusable UI components
│   │       ├── Input/              # Text input component
│   │       ├── Select/             # Dropdown select
│   │       ├── Checkbox/           # Checkbox component
│   │       ├── Radio/              # Radio button
│   │       ├── Toast/              # Notification system
│   │       ├── Loader/             # Loading spinner
│   │       └── SelectionInput/     # Base selection component
│   ├── hooks/                      # Custom React hooks
│   │   ├── infinite-scroll/        # Infinite scroll hooks
│   │   ├── keyboard-navigation/    # Keyboard nav hooks
│   │   ├── use-debounce.ts         # Debounce hook
│   │   ├── use-throttle.ts         # Throttle hook
│   │   ├── use-local-storage.ts    # LocalStorage hook
│   │   └── ...                     # More utility hooks
│   ├── adapters/                   # API adapter pattern
│   │   ├── data-adapter.ts         # Adapter interface
│   │   └── ...                     # Adapter implementations
│   ├── lib/                        # Utilities
│   │   ├── api-client.ts           # HTTP client
│   │   └── class-selectors.ts      # CSS module utilities
│   ├── providers/                  # React context providers
│   │   ├── QueryProvider.tsx       # TanStack Query setup
│   │   └── AnnouncementProvider.tsx # A11y announcements
│   ├── queries/                    # React Query configs
│   │   └── keys.ts                 # Query key factory
│   ├── styles/                     # Global styles
│   │   ├── globals.css             # CSS variables & reset
│   │   └── utilities.module.css    # Utility classes
│   └── types/                      # Shared TypeScript types
├── public/                         # Static assets
├── scripts/                        # CLI tools
│   └── generate-component/         # Component generator
├── .storybook/                     # Storybook configuration
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config
├── vitest.config.ts                # Test configuration
└── next.config.ts                  # Next.js configuration
```

---

## Getting Started

### 1. Environment Configuration

Create a `.env.local` file:

```bash
cp web/.env.local.example web/.env.local
```

**Required variables:**

```bash
# API Configuration
# Point this to your backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 2. Install Dependencies

From the **monorepo root**:

```bash
pnpm install
```

### 3. Run Development Server

```bash
# From monorepo root
pnpm nx serve web

# Or from web directory
cd web
pnpm dev
```

The app will be available at **http://localhost:4200**

**Features enabled:**
- ⚡ Turbopack for faster builds
- 🔥 Hot module replacement
- 🔍 React Query DevTools (in development)

---

## Component Library

The template includes 8+ production-ready components with full accessibility support.

### Input Component

Text input with validation states and sizes.

```tsx
import { Input } from "@/components/shared/Input";

function MyForm() {
  return (
    <Input
      label="Email"
      type="email"
      placeholder="Enter your email"
      size="md"
      error="Invalid email address"
    />
  );
}
```

**Props:**
- `label` - Accessible label text
- `type` - Input type (text, email, password, etc.)
- `size` - Size variant: `sm | md | lg`
- `error` - Error message to display
- `disabled` - Disabled state
- Plus all native `<input>` props

**Storybook:** Run `pnpm storybook` to see all variants

### Select Component

Dropdown select with custom styling.

```tsx
import { Select } from "@/components/shared/Select";

function MyForm() {
  const options = [
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ];

  return (
    <Select
      label="Choose an option"
      options={options}
      placeholder="Select..."
      onChange={(e) => console.log(e.target.value)}
    />
  );
}
```

### Checkbox Component

Accessible checkbox with custom styling.

```tsx
import { Checkbox } from "@/components/shared/Checkbox";

function MyForm() {
  return (
    <Checkbox
      label="I agree to the terms"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
  );
}
```

### Radio Component

Radio buttons with group management.

```tsx
import { Radio } from "@/components/shared/Radio";

function MyForm() {
  return (
    <div>
      <Radio
        name="plan"
        value="basic"
        label="Basic Plan"
        checked={plan === "basic"}
        onChange={(e) => setPlan(e.target.value)}
      />
      <Radio
        name="plan"
        value="pro"
        label="Pro Plan"
        checked={plan === "pro"}
        onChange={(e) => setPlan(e.target.value)}
      />
    </div>
  );
}
```

### Toast Notifications

Global notification system with queue management.

```tsx
import { useToast } from "@/components/shared/Toast";

function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast({
      message: "Operation successful!",
      type: "success",
      duration: 3000,
    });
  };

  return <button onClick={handleClick}>Show Toast</button>;
}
```

**Toast types:** `success | error | warning | info`

**Setup required:**
```tsx
// app/layout.tsx
import { ToastProvider } from "@/components/shared/Toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
```

### Loader Component

Loading spinner with customizable size.

```tsx
import { Loader } from "@/components/shared/Loader";

function LoadingState() {
  return (
    <div>
      <Loader size="lg" />
      <p>Loading...</p>
    </div>
  );
}
```

### SmartErrorBoundary

Multi-level error handling with retry logic.

```tsx
import { SmartErrorBoundary } from "@/components/SmartErrorBoundary";

// Component-level error boundary
<SmartErrorBoundary context="ProductList" level="component" maxRetries={3}>
  <ProductList />
</SmartErrorBoundary>

// Page-level error boundary (adds navigation)
<SmartErrorBoundary context="CheckoutPage" level="page">
  <CheckoutPage />
</SmartErrorBoundary>

// App-level error boundary (full recovery)
<SmartErrorBoundary context="App" level="app">
  <App />
</SmartErrorBoundary>
```

**Levels:**
- `component` - Local error with retry button
- `page` - Page error with back/home navigation
- `app` - Critical error with full app reload

---

## Custom Hooks

### useInfiniteData

API-agnostic infinite scroll with React Query.

```tsx
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { DummyJSONProductAdapter } from "@/adapters/dummyjson-product-adapter";
import { fetcher } from "@/lib/api-client";

function ProductList() {
  const adapter = new DummyJSONProductAdapter(20);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteData({
    queryKey: ["products", filters],
    adapter,
    fetcher,
    filters,
  });

  const products = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
}
```

### useInfiniteScroll

Automatic infinite scroll with IntersectionObserver.

```tsx
import { useInfiniteScroll } from "@/hooks/infinite-scroll/use-infinite-scroll";

function ProductList() {
  const { data, targetRef, isFetching } = useInfiniteScroll({
    queryKey: ["products"],
    adapter,
    fetcher,
    filters,
    rootMargin: "200px", // Prefetch when 200px from bottom
  });

  return (
    <div>
      {/* Render products */}
      <div ref={targetRef} /> {/* Scroll trigger */}
      {isFetching && <Loader />}
    </div>
  );
}
```

### useDebounce

Debounce rapidly changing values (e.g., search inputs).

```tsx
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

function SearchInput() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // Use debouncedSearch for API calls
  const { data } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### useKeyboardNavigation

Keyboard interaction with focus management.

```tsx
import { useKeyboardNavigation } from "@/hooks/keyboard-navigation/use-keyboard-navigation";

function Modal() {
  const ref = useRef<HTMLDivElement>(null);

  useKeyboardNavigation({
    containerRef: ref,
    onEscape: () => setIsOpen(false),
    trapFocus: true,
    restoreFocus: true,
  });

  return <div ref={ref}>{/* Modal content */}</div>;
}
```

### useGridNavigation

Grid keyboard navigation with arrow keys.

```tsx
import { useGridNavigation } from "@/hooks/keyboard-navigation/use-grid-navigation";

function ProductGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGridNavigation({
    containerRef: gridRef,
    columns: 3,
    onEnter: (index) => console.log("Selected:", index),
  });

  return (
    <div ref={gridRef} className={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### useLocalStorage

Persistent state in localStorage.

```tsx
import { useLocalStorage } from "@/hooks/use-local-storage";

function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <Select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      options={[
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ]}
    />
  );
}
```

### useThrottle

Throttle rapidly firing events.

```tsx
import { useThrottle } from "@/hooks/use-throttle";

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use throttledScrollY to reduce re-renders
}
```

---

## Adapter Pattern

The adapter pattern decouples your UI from specific APIs, making it easy to switch backends.

### DataAdapter Interface

```typescript
interface DataAdapter<TItem, TFilters, TResponse, TPageParam> {
  buildURL(filters: TFilters, pageParam: TPageParam): string;
  parseResponse(response: TResponse): {
    items: TItem[];
    total: number;
    hasNextPage: boolean;
  };
  getNextPageParam(lastPage: ParsedPage<TItem>, allPages: ParsedPage<TItem>[]): TPageParam | undefined;
  initialPageParam: TPageParam;
}
```

### Creating an Adapter

```typescript
// adapters/my-api-product-adapter.ts
export class MyAPIProductAdapter implements DataAdapter<Product, ProductFilters, MyAPIResponse, number> {
  constructor(private limit: number = 20) {}

  buildURL(filters: ProductFilters, pageParam: number): string {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: this.limit.toString(),
      ...filters,
    });
    return `/api/products?${params}`;
  }

  parseResponse(response: MyAPIResponse) {
    return {
      items: response.data.map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
      })),
      total: response.pagination.total,
      hasNextPage: response.pagination.hasMore,
    };
  }

  getNextPageParam(lastPage, allPages) {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }

  initialPageParam = 1;
}
```

### Using Adapters

```tsx
// Switch adapters without changing component code
const adapter = new MyAPIProductAdapter(20);
// const adapter = new DummyJSONProductAdapter(20);

const { data } = useInfiniteData({
  queryKey: ["products"],
  adapter,
  fetcher,
  filters: {},
});
```

**Benefits:**
- Swap APIs without refactoring components
- Test with mock adapters
- Normalize different API response formats
- Share pagination logic across features

---

## API Client

Type-safe HTTP client with error handling.

### Configuration

Set the base URL in `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Usage

```typescript
import { fetcher, postFetcher } from "@/lib/api-client";

// GET request
const data = await fetcher<User[]>("/users");

// POST request
const newUser = await postFetcher<User, CreateUserDTO>("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// PUT request
import { putFetcher } from "@/lib/api-client";
const updated = await putFetcher<User, UpdateUserDTO>(`/users/${id}`, data);

// DELETE request
import { deleteFetcher } from "@/lib/api-client";
await deleteFetcher(`/users/${id}`);
```

### Error Handling

The client throws `APIError` with structured information:

```typescript
import { APIError } from "@/lib/api-client";

try {
  const data = await fetcher("/users");
} catch (error) {
  if (error instanceof APIError) {
    console.error(error.status);      // 404
    console.error(error.statusText);  // "Not Found"
    console.error(error.data);        // Server error message
  }
}
```

### Timeout

Default timeout is 10 seconds. Configure in `api-client.ts`:

```typescript
const TIMEOUT_MS = 10000;
```

---

## Styling System

### CSS Modules

Components use CSS modules for scoped styling:

```tsx
// component.tsx
import styles from "./component.module.css";

export function Component() {
  return <div className={styles.container}>Content</div>;
}
```

```css
/* component.module.css */
.container {
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
}
```

### Type-Safe CSS Classes

TypeScript plugin provides autocomplete for CSS classes:

```tsx
import styles from "./component.module.css";

// Autocomplete available for styles.container, styles.button, etc.
<div className={styles.container} />
```

### CSS Custom Properties

Global design tokens in `src/styles/globals.css`:

```css
:root {
  /* Colors */
  --color-primary: #0070f3;
  --color-secondary: #7928ca;
  --color-bg-primary: #ffffff;
  --color-text-primary: #000000;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #000000;
    --color-text-primary: #ffffff;
  }
}
```

### Utility Classes

Reusable utilities in `src/styles/utilities.module.css`:

```tsx
import utils from "@/styles/utilities.module.css";

<div className={utils.flexCenter}>
  <span className={utils.textBold}>Bold Text</span>
</div>
```

### Conditional Classes with clsx

```tsx
import clsx from "clsx";
import styles from "./button.module.css";

function Button({ variant, disabled }) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        disabled && styles["button--disabled"]
      )}
    >
      Click me
    </button>
  );
}
```

---

## State Management

### Server State (TanStack Query)

For API data, use React Query:

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api-client";

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetcher<User>(`/users/${userId}`),
    staleTime: 60000, // 1 minute
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading user</div>;

  return <div>{data.name}</div>;
}
```

**Mutations:**

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFetcher } from "@/lib/api-client";

function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateUserDTO) => postFetcher("/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate(formData);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Client State (React Hooks)

For local UI state:

```tsx
import { useState, useReducer } from "react";

// Simple state
const [count, setCount] = useState(0);

// Complex state
const [state, dispatch] = useReducer(reducer, initialState);
```

### Form State (React Hook Form)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        label="Email"
        error={errors.email?.message}
      />
      <Input
        {...register("password")}
        label="Password"
        type="password"
        error={errors.password?.message}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Testing

### Running Tests

```bash
# Watch mode (default)
pnpm nx test web

# Run once
pnpm nx test web --run

# With UI
pnpm nx test web --ui

# With coverage
pnpm nx test web --coverage
```

### Writing Tests

```tsx
// component.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Input label="Email" error="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
```

### Testing Hooks

```tsx
// use-debounce.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  it("debounces value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated" });
    expect(result.current).toBe("initial");

    await waitFor(() => expect(result.current).toBe("updated"), {
      timeout: 500,
    });
  });
});
```

### Testing with React Query

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

---

## Component Generator

Generate new components with a CLI tool:

```bash
# Interactive mode
pnpm generate

# With arguments
pnpm generate MyComponent --client --styles --props "title: string; count: number"
```

**Generated files:**
```
src/components/MyComponent/
├── index.ts                  # Barrel export
├── my-component.tsx          # Component file
└── my-component.module.css   # Styles (if --styles)
```

**Options:**
- `--client` - Add "use client" directive
- `--styles` - Generate CSS module
- `--props` - Define TypeScript props

---

## Storybook

Interactive component documentation and testing.

### Running Storybook

```bash
pnpm nx run web:storybook
# Opens at http://localhost:6006
```

### Writing Stories

```tsx
// input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    error: "Invalid email address",
  },
};
```

### Building Storybook

```bash
pnpm nx run web:build-storybook
# Output: web/storybook-static/
```

---

## Accessibility

### Built-in A11y Features

1. **Screen Reader Announcements**
   ```tsx
   import { LoadingAnnouncer } from "@/components/Accessibility/Announcer/Loading";

   <LoadingAnnouncer isLoading={isLoading} message="Loading products..." />
   ```

2. **Keyboard Navigation**
   - All components support keyboard interaction
   - Focus management with `useKeyboardNavigation`
   - Grid navigation with arrow keys

3. **ARIA Labels**
   - Enforced by Biome linter (`useAltText: error`)
   - Proper roles and labels on all components

4. **Color Contrast**
   - CSS variables designed for WCAG AA compliance
   - Dark mode support

### Testing A11y

Storybook includes the a11y addon:

```bash
pnpm storybook
# Check A11y tab in each story
```

---

## Environment Variables

### Public Variables

Prefix with `NEXT_PUBLIC_` to expose to the browser:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_NAME=My App
```

**Usage:**
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

### Server-Only Variables

No prefix required for server-side code:

```bash
DATABASE_URL=postgresql://...
SECRET_KEY=xyz123
```

**Usage in Server Components:**
```tsx
// app/page.tsx (Server Component)
const secret = process.env.SECRET_KEY; // Works
```

---

## Building for Production

### Build

```bash
# From monorepo root
pnpm nx build web

# Output: web/.next/
```

### Run Production Server

```bash
cd web
pnpm start
```

### Optimize for Production

1. **Enable Output Standalone** (already configured):
   ```typescript
   // next.config.ts
   output: "standalone"
   ```

2. **Image Optimization**: Use `next/image` component

3. **Code Splitting**: Automatic with App Router

4. **Bundle Analysis**:
   ```bash
   pnpm add -D @next/bundle-analyzer
   ```

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm nx build web

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./web/.next/static
COPY --from=builder /app/web/public ./web/public

EXPOSE 4200
ENV PORT=4200
CMD ["node", "web/server.js"]
```

---

## Troubleshooting

### Module Not Found

```bash
# Clear Next.js cache
rm -rf web/.next

# Rebuild
pnpm nx build web
```

### TypeScript Errors in CSS Modules

```bash
# Regenerate CSS types
pnpm nx build web
```

### React Query DevTools Not Showing

DevTools are only enabled in development. Check `NODE_ENV`:

```tsx
// QueryProvider.tsx
<ReactQueryDevtools initialIsOpen={false} />
```

### Storybook Build Fails

```bash
# Clear cache
rm -rf web/node_modules/.cache

# Rebuild
pnpm nx run web:build-storybook
```

---

## Additional Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **React Documentation:** https://react.dev
- **TanStack Query:** https://tanstack.com/query/latest
- **React Hook Form:** https://react-hook-form.com
- **Vitest:** https://vitest.dev
- **Storybook:** https://storybook.js.org

---

## Related Documentation

- [API Documentation](./API.md) - Backend (NestJS) documentation
- [Setup Guide](../SETUP.md) - Initial project setup
- [Customization Guide](../CUSTOMIZATION.md) - How to customize the template
- [Architecture Guide](../TEMPLATE_GUIDE.md) - Overall architecture and patterns
