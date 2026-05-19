# Next.js Template

A modern, production-ready Next.js template with a comprehensive development setup featuring custom component generation, type-safe CSS modules, robust error handling, infinite scroll with adapter pattern, accessible UI components, and Storybook integration.

## 📑 Table of Contents

-   [Tech Stack](#-tech-stack)
-   [Key Features](#-key-features)
-   [Prerequisites](#-prerequisites)
-   [Getting Started](#-getting-started)
-   [Project Structure](#-project-structure)
-   [Component Generator](#-component-generator)
-   [Code Conventions](#-code-conventions)
-   [Custom Hooks](#-custom-hooks)
-   [Data Adapters](#-data-adapters)
-   [Shared UI Components](#-shared-ui-components)
-   [Accessibility Features](#-accessibility-features)
-   [Storybook](#-storybook)
-   [Testing](#-testing)
-   [Commit Conventions](#-commit-conventions)
-   [Styling System](#-styling-system)
-   [Configuration](#-configuration)
-   [Deployment](#-deployment)
-   [Contributing](#-contributing)

## 🚀 Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) with App Router
-   **Language**: TypeScript
-   **Styling**: CSS Modules with PostCSS
-   **State Management**: [TanStack Query](https://tanstack.com/query) (React Query)
-   **Testing**: [Vitest](https://vitest.dev/) with React Testing Library
-   **Component Development**: [Storybook](https://storybook.js.org/)
-   **Linting/Formatting**: [Biome](https://biomejs.dev/)
-   **Git Hooks**: Husky with Commitlint
-   **Package Manager**: pnpm
-   **Node Version**: 22.20.0 (managed via Volta)

## ✨ Key Features

-   **🎨 Component Library** - Pre-built, accessible UI components (Input, Select, Checkbox, Toast)
-   **♾️ Infinite Scroll** - API-agnostic data fetching with adapter pattern
-   **🪝 Custom Hooks** - useDebounce, useInfiniteScroll, useKeyboardNavigation, and more
-   **♿ Accessibility** - Screen reader support, keyboard navigation, ARIA compliance
-   **📖 Storybook** - Interactive component development and documentation
-   **🛡️ Type Safety** - Full TypeScript support with strict mode
-   **🎭 Error Handling** - Smart error boundaries with retry logic
-   **🎨 Styling System** - CSS Modules with type-safe selectors and CSS variables
-   **⚡ Component Generator** - CLI tool for rapid component scaffolding
-   **🧪 Testing** - Vitest + React Testing Library with coverage reports
-   **📏 Code Quality** - Biome for linting/formatting, Husky for git hooks

## 📋 Prerequisites

-   Node.js 22.20.0 (or use [Volta](https://volta.sh/) for automatic version management)
-   pnpm 8.x or higher

## 🛠️ Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests in watch mode
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report

# Storybook
pnpm storybook        # Start Storybook dev server
pnpm build-storybook  # Build Storybook for production

# Code Quality
pnpm format           # Check formatting
pnpm format:write     # Fix formatting
pnpm check            # Lint and check code
pnpm check:write      # Lint and auto-fix

# Component Generation
pnpm generate         # Interactive component generator
```

## 🏗️ Project Structure

```
├── src/
│   ├── app/                                    # Next.js App Router pages
│   │   ├── layout.tsx                          # Root layout
│   │   └── page.tsx                            # Home page
│   ├── components/                             # Reusable components
│   │   ├── Accessibility/                      # Accessibility components
│   │   │   └── Announcer/                      # Screen reader announcers
│   │   │       ├── Loading/                    # Loading state announcer
│   │   │       └── Search/                     # Search result announcer
│   │   ├── shared/                             # Shared UI components
│   │   │   ├── Input/                          # Input component with variants
│   │   │   ├── Select/                         # Select dropdown component
│   │   │   ├── Checkbox/                       # Checkbox component
│   │   │   └── Toast/                          # Toast notification system
│   │   └── SmartErrorBoundary/                 # Error boundary with retry logic
│   ├── hooks/                                  # Custom React hooks
│   │   ├── infinite-scroll/                    # Infinite scroll hooks
│   │   │   ├── use-infinite-scroll.ts          # Core infinite scroll logic
│   │   │   ├── use-infinite-products.ts        # Product-specific infinite scroll
│   │   │   └── use-prefetch.ts                 # Data prefetching
│   │   ├── keyboard-navigation/                # Keyboard navigation hooks
│   │   │   ├── use-keyboard-navigation.ts      # Core keyboard navigation
│   │   │   └── use-grid-navigation.ts          # Grid navigation logic
│   │   ├── use-debounce.ts                     # Debounce hook
│   │   ├── use-filter-params.ts                # URL filter params management
│   │   └── use-infinite-data.ts                # API-agnostic infinite data fetching
│   ├── adapters/                               # Data adapter pattern
│   │   ├── data-adapter.ts                     # Base adapter interface
│   │   ├── dummyjson-product-adapter.ts        # DummyJSON API adapter
│   │   ├── custom-backend-product-adapter.ts # Custom backend adapter
│   │   └── README.md                           # Adapter documentation
│   ├── lib/                                    # Utility functions
│   │   ├── class-selectors.ts                  # Type-safe CSS module helpers
│   │   ├── api-client.ts                       # Fetch wrapper with error handling
│   │   └── api-client.example.ts               # API client usage examples
│   ├── providers/                              # React context providers
│   │   ├── QueryProvider.tsx                   # TanStack Query setup
│   │   └── AnnouncementProvider.tsx            # Screen reader announcements
│   └── styles/                                 # Global styles
│       ├── globals.css                         # CSS variables & reset
│       └── utilities.module.css                # Utility classes
├── scripts/
│   └── generate-component/                     # Component generator
│       ├── index.ts                            # Generator CLI
│       └── templates/                          # Component templates
├── .storybook/                                 # Storybook configuration
│   ├── main.ts                                 # Main Storybook config
│   ├── preview.tsx                             # Global preview settings
│   ├── manager.ts                              # Manager config
│   └── theme.ts                                # Custom theme
└── public/                                     # Static assets
```

## 🎨 Component Generator

Generate new components quickly with the custom CLI:

```bash
# Basic server component
pnpm generate MyComponent

# Client component with styles
pnpm generate MyButton --client --styles

# Component with props
pnpm generate UserCard --props "name: string; age: number; email: string"

# Custom directory (relative to /src)
pnpm generate Header --directory "components/layout"

# Force overwrite existing component
pnpm generate MyComponent --force
```

### Generator Options

-   `-c, --client` - Generate client component (default: server component)
-   `-s, --styles` - Generate CSS module file
-   `-p, --props <props>` - Define component props (format: `"name: type; name2: type2"`)
-   `-d, --directory <path>` - Target directory relative to `/src` (default: `components`)
-   `-f, --force` - Overwrite existing component

### Generated Files

Each component includes:

-   `component-name.tsx` - Component file
-   `component-name.module.css` - CSS module (if `--styles` flag used)
-   `index.ts` - Barrel export for cleaner imports

## 🎯 Code Conventions

### CSS Modules

Type-safe CSS module usage with custom selectors:

```tsx
import { createStrictClassSelector } from "@/lib/class-selectors";
import styles from "./component.module.css";

const css = createStrictClassSelector(styles);

function Component() {
    return <div className={css("container")}>Content</div>;
}
```

### Utility Classes

Reusable utility classes are available in `utilities.module.css`:

```tsx
import utilities from "@/styles/utilities.module.css";

const cssUtils = createStrictClassSelector(utilities);

<div className={cssUtils("flex", "itemsCenter")} />;
```

### Error Boundaries

Use `SmartErrorBoundary` for robust error handling:

```tsx
import SmartErrorBoundary from "@/components/SmartErrorBoundary";

<SmartErrorBoundary context="UserProfile" level="component" maxRetries={3} enableNavigation={false}>
    <UserProfile />
</SmartErrorBoundary>;
```

**Levels:**

-   `component` - Local component errors
-   `page` - Page-level errors (adds navigation buttons)
-   `app` - Application-level errors (adds reload/home buttons)

## 🪝 Custom Hooks

### Data Fetching & Infinite Scroll

#### `useInfiniteData`

API-agnostic infinite data fetching with adapter pattern:

```tsx
import { useInfiniteData } from "@/hooks/use-infinite-data";
import { DummyJSONProductAdapter } from "@/adapters/dummyjson-product-adapter";
import { fetcher } from "@/lib/api-client";

const adapter = new DummyJSONProductAdapter(20);

function ProductList() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteData({
        queryKey: ["products"],
        adapter,
        fetcher,
        filters: { search: "phone", category: "smartphones" },
    });

    return (
        <div>
            {data?.items.map((product) => (
                <div key={product.id}>{product.title}</div>
            ))}
            {hasNextPage && (
                <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    Load More
                </button>
            )}
        </div>
    );
}
```

#### `useInfiniteScroll`

Automatic infinite scrolling with IntersectionObserver:

```tsx
import { useInfiniteScroll } from "@/hooks/infinite-scroll/use-infinite-scroll";

function InfiniteList() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteData({
        /* ... */
    });

    const { triggerRef } = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        onLoadMore: fetchNextPage,
        rootMargin: "200px", // Load when 200px from bottom
        threshold: 0.1,
    });

    return (
        <div>
            {data?.items.map((item) => (
                <div key={item.id}>{item.title}</div>
            ))}
            {/* Trigger element for intersection observer */}
            <div ref={triggerRef} />
            {isFetchingNextPage && <div>Loading more...</div>}
        </div>
    );
}
```

### State Management

#### `useDebounce`

Debounce rapidly changing values:

```tsx
import { useDebounce } from "@/hooks/use-debounce";

function SearchInput() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500); // 500ms delay

    useEffect(() => {
        // Only runs after user stops typing for 500ms
        fetchResults(debouncedSearch);
    }, [debouncedSearch]);

    return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

### Keyboard Navigation

#### `useKeyboardNavigation`

Handle keyboard interactions with focus management:

```tsx
import { useKeyboardNavigation } from "@/hooks/keyboard-navigation/use-keyboard-navigation";

function Modal({ onClose }) {
    const { containerRef } = useKeyboardNavigation({
        onEscape: onClose,
        onEnter: handleSubmit,
        trapFocus: true, // Keep focus within modal
        restoreFocus: true, // Restore focus when unmounted
    });

    return <div ref={containerRef}>{/* Modal content */}</div>;
}
```

#### `useGridNavigation`

Navigate items in a grid with arrow keys:

```tsx
import { useGridNavigation } from "@/hooks/keyboard-navigation/use-grid-navigation";

function ProductGrid({ products }) {
    const { containerRef, focusedIndex } = useGridNavigation({
        itemCount: products.length,
        columns: 4,
        onSelect: (index) => openProduct(products[index]),
    });

    return (
        <div ref={containerRef}>
            {products.map((product, index) => (
                <div key={product.id} data-focused={focusedIndex === index}>
                    {product.title}
                </div>
            ))}
        </div>
    );
}
```

## 🔌 Data Adapters

The adapter pattern allows you to swap APIs without changing your application code. See the comprehensive [Adapter Documentation](src/adapters/README.md) for detailed examples.

### Quick Start

```tsx
// 1. Create an adapter for your API
import type { DataAdapter } from "@/adapters/data-adapter";

class MyAPIAdapter implements DataAdapter<Product, Filters, Response, number> {
    initialPageParam = 1;

    buildURL(filters: Filters, page: number): string {
        return `/api/products?page=${page}&search=${filters.search}`;
    }

    parseResponse(response: Response) {
        return {
            items: response.data,
            total: response.total,
            hasNextPage: response.hasMore,
        };
    }

    getNextPageParam(lastPage, allPages) {
        return lastPage.hasNextPage ? allPages.length + 1 : undefined;
    }
}

// 2. Use with useInfiniteData
const adapter = new MyAPIAdapter();
const { data } = useInfiniteData({ adapter, fetcher, filters });
```

**Benefits:**

-   🔄 Swap APIs by changing adapter only
-   🧪 Easy testing with mock adapters
-   📦 Reusable across different data sources
-   🛡️ Full TypeScript support

**Included Adapters:**

-   `DummyJSONProductAdapter` - Skip-based pagination example
-   `CustomBackendProductAdapter` - Page-based pagination example

## 🎨 Shared UI Components

### Input

Text input with variants and states:

```tsx
import { Input } from "@/components/shared";

<Input
    variant="outlined" // outlined | filled | ghost
    size="medium" // small | medium | large
    error="Invalid email"
    placeholder="Enter email..."
/>;
```

### Select

Dropdown select component:

```tsx
import { Select } from "@/components/shared";

<Select
    options={[
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
    ]}
    onChange={(value) => console.log(value)}
    placeholder="Select an option"
/>;
```

### Checkbox

Accessible checkbox component:

```tsx
import { Checkbox } from "@/components/shared";

<Checkbox label="Accept terms" checked={accepted} onChange={setAccepted} />;
```

### Toast Notifications

Display toast notifications with the toast system:

```tsx
import { toast } from "@/components/shared/Toast";

// Add ToastProvider to your layout
import { ToastProvider } from "@/components/shared/Toast";

function RootLayout({ children }) {
    return (
        <ToastProvider maxToasts={5} position="top-right">
            {children}
        </ToastProvider>
    );
}

// Use toast in components
toast.success("Operation completed!");
toast.error("Something went wrong");
toast.info("New message received");
toast.warning("Please save your work");

// With custom duration and actions
toast.success("File uploaded", {
    duration: 5000,
    action: { label: "View", onClick: () => navigate("/files") },
});
```

## ♿ Accessibility Features

### AnnouncementProvider

Screen reader announcements for dynamic content:

```tsx
import { AnnouncementProvider, useAnnouncement } from "@/providers/AnnouncementProvider";

// Add to root layout
function RootLayout({ children }) {
    return <AnnouncementProvider>{children}</AnnouncementProvider>;
}

// Use in components
function MyComponent() {
    const { announce } = useAnnouncement();

    const handleAction = () => {
        // Announce to screen readers
        announce("Item added to cart", "polite");
    };
}
```

### Screen Reader Announcers

-   **LoadingAnnouncer** - Announces loading states
-   **SearchAnnouncer** - Announces search results count

```tsx
import { LoadingAnnouncer } from "@/components/Accessibility/Announcer/Loading";
import { SearchAnnouncer } from "@/components/Accessibility/Announcer/Search";

<LoadingAnnouncer isLoading={isLoading} message="Loading products" />
<SearchAnnouncer resultCount={results.length} query={searchQuery} />
```

## 📖 Storybook

Develop and document components in isolation:

```bash
# Start Storybook
pnpm storybook

# Build static Storybook
pnpm build-storybook
```

View component stories at [http://localhost:6006](http://localhost:6006)

**Features:**

-   Interactive component development
-   Automatic documentation
-   Accessibility testing with a11y addon
-   Responsive viewport testing
-   Component interaction testing

All shared components include Storybook stories (`.stories.tsx` files).

## 🧪 Testing

Tests are powered by Vitest and React Testing Library:

```bash
# Run tests
pnpm test

# Watch mode with UI
pnpm test:ui

# Generate coverage
pnpm test:coverage
```

Example test:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Component from "./component";

describe("Component", () => {
    it("renders correctly", () => {
        render(<Component />);
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });
});
```

## 📝 Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by Commitlint.

### Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

-   `feat` - New feature
-   `fix` - Bug fix
-   `docs` - Documentation changes
-   `style` - Code style changes (formatting, etc.)
-   `refactor` - Code refactoring
-   `perf` - Performance improvements
-   `test` - Adding or updating tests
-   `chore` - Maintenance tasks
-   `ci` - CI/CD changes
-   `build` - Build system changes
-   `revert` - Revert previous commit

### Scopes

Scopes must be UPPERCASE:

-   `CORE` - Core functionality
-   `API` - API related
-   `UI` - User interface
-   `DB` - Database
-   `CONFIG` - Configuration
-   `AUTH` - Authentication
-   `SEARCH` - Search functionality
-   `CHECKOUT` - Checkout process
-   `CI` - CI/CD
-   `BUILD` - Build process
-   Branch name (automatically detected)

### Examples

```bash
git commit -m "feat(UI): add user profile component"
git commit -m "fix(API): resolve authentication timeout"
git commit -m "docs(CORE): update README with new features"
```

## 🎨 Styling System

### CSS Custom Properties

All design tokens are defined in `globals.css`:

```css
/* Colors */
--color-primary
--color-secondary
--color-text-primary
--color-text-secondary
--color-action-primary

/* Spacing */
--spacing-xs to --spacing-2xl

/* Border Radius */
--radius-sm to --radius-xl

/* Font Sizes */
--font-size-xs to --font-size-4xl

/* Font Weights */
--font-weight-normal to --font-weight-bold
```

### Dark Mode

Dark mode is automatically supported via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-main: hsl(0, 0%, 10%);
        /* ... */
    }
}
```

## 🔧 Configuration

### Editor Setup (VS Code)

The project includes VS Code settings for:

-   Auto-format on save with Biome
-   Organize imports automatically
-   CSS validation
-   TypeScript integration

### PostCSS

Configured with:

-   `postcss-custom-media` - Custom media queries
-   `autoprefixer` - Vendor prefixes

### Biome Configuration

Format and lint settings in `biome.json`:

-   120 character line width
-   Tabs for indentation (4 spaces)
-   Double quotes
-   ES5 trailing commas

## 📚 Learn More

### Next.js Resources

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Learn Next.js](https://nextjs.org/learn)
-   [Next.js GitHub](https://github.com/vercel/next.js)

### Additional Resources

-   [TanStack Query Docs](https://tanstack.com/query/latest)
-   [Storybook Documentation](https://storybook.js.org/docs)
-   [Biome Documentation](https://biomejs.dev/)
-   [Vitest Documentation](https://vitest.dev/)
-   [Adapter Pattern Guide](src/adapters/README.md) - Local documentation

## 🚢 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to a Git repository
2. Import your project to Vercel
3. Vercel will auto-detect Next.js and configure deployment
4. Your app will be live!

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other hosting options.

## 🤝 Contributing

1. Follow the commit conventions
2. Run `pnpm check:write` before committing (automated via Husky)
3. Write tests for new features
4. Update documentation as needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
