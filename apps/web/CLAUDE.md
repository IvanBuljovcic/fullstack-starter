# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Interaction Guidelines

- **DO NOT suggest or write code unless explicitly requested**
- Answer questions with explanations and guidance only
- If code examples would be helpful, **ASK** first before providing them
- Respect the user's explicit instructions throughout the conversation

## Development Commands

### Testing

```bash
pnpm test              # Run tests in watch mode (Vitest)
pnpm test:ui           # Run tests with interactive UI
pnpm test:coverage     # Generate coverage report
```

Run a single test file:

```bash
pnpm test src/components/shared/Input/input.test.tsx
```

### Code Quality

```bash
pnpm check             # Lint and check code with Biome
pnpm check:write       # Lint and auto-fix issues
pnpm format:write      # Auto-format all files
```

Pre-commit hook automatically runs `pnpm check:staged` to ensure staged files pass Biome checks.

### Component Generation

```bash
pnpm generate          # Interactive component generator
pnpm generate MyComponent --client --styles --props "name: string; age: number"
```

### Storybook

```bash
pnpm storybook         # Start Storybook dev server on port 6006
pnpm build-storybook   # Build static Storybook
```

### Development

```bash
pnpm dev               # Start Next.js dev server with Turbopack
pnpm build             # Production build
```

## Architecture Overview

### CSS Module Pattern

This codebase uses CSS modules with the `clsx` library for conditional class composition:

```tsx
import clsx from 'clsx';
import styles from './component.module.css';

const className = clsx(
  styles.input,
  styles[`input--${size}`], // Dynamic class names
  hasError && styles['input--error'], // Conditional classes
  className // Pass-through classes
);
```

**Type safety**: TypeScript plugin `typescript-plugin-css-modules` provides autocomplete and validation for CSS module class names (configured in tsconfig.json with camelCase transformation).

**Alternative pattern**: For additional type safety, use `createStrictClassSelector` from `@/lib/class-selectors` which provides runtime validation in development mode.

For utility classes, use `@/styles/utilities.module.css`.

### Adapter Pattern for Data Fetching

The codebase implements an adapter pattern to make API integration swappable. This is crucial for maintainability.

**Core concept**: The `DataAdapter` interface (in `src/adapters/data-adapter.ts`) standardizes how different APIs are consumed. Instead of hardcoding API-specific logic throughout the app, adapters handle:

- URL construction with filters and pagination
- Response parsing into a standard format
- Next page parameter calculation

**When to use**: Any time you need infinite scroll or paginated data fetching, use `useInfiniteData` with an adapter:

```tsx
import { useInfiniteData } from '@/hooks/use-infinite-data';
import { DummyJSONProductAdapter } from '@/adapters/dummyjson-product-adapter';
import { fetcher } from '@/lib/api-client';

const adapter = new DummyJSONProductAdapter(20);
const { data, fetchNextPage } = useInfiniteData({
  queryKey: ['products', filters],
  adapter,
  fetcher,
  filters,
});
```

**Creating new adapters**: Implement the `DataAdapter<TItem, TFilters, TResponse, TPageParam>` interface. See existing adapters in `src/adapters/` for reference patterns.

### Error Boundary Strategy

Use `SmartErrorBoundary` for all error handling with different levels:

- `level="component"` - Local component errors (basic retry)
- `level="page"` - Page-level errors (adds back/home navigation)
- `level="app"` - Root-level errors (full app recovery)

Example:

```tsx
<SmartErrorBoundary context="ProductList" level="component" maxRetries={3}>
  <ProductList />
</SmartErrorBoundary>
```

### Path Alias

All imports use the `@/` alias which maps to `src/`:

```tsx
import { Input } from '@/components/shared/Input';
import { fetcher } from '@/lib/api-client';
```

### Component Structure

When creating new components:

- Use the component generator (`pnpm generate`) for consistency
- Client components must have `"use client"` directive
- Include index.ts barrel exports for clean imports
- Co-locate tests (.test.tsx) and stories (.stories.tsx)
- Use CSS modules (.module.css) for styling
- Use `forwardRef` and `ComponentPropsWithoutRef<"element">` for proper ref forwarding and native HTML props
- Omit conflicting props like `"size"` or `"type"` when extending native elements with custom props

**Shared component pattern**: For components with similar behavior (e.g., Checkbox and Radio), create a base component with variant discriminated unions. See `SelectionInput` which serves as the base for both Checkbox and Radio components, reducing code duplication while maintaining type safety.

### State Management

- **TanStack Query** (React Query) for server state
- **React Hook Form + Zod** for forms (configured via `@hookform/resolvers`)
- Local state via useState/useReducer as needed

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

The API client in `src/lib/api-client.ts` expects `NEXT_PUBLIC_API_BASE_URL` to be set.

## Commit Conventions

Commits are enforced via commitlint with conventional commits format:

```
<type>(<scope>): <description>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert

**Scopes** (MUST be UPPERCASE):

- Auto-detected from branch name (e.g., branch `feature/auth` uses scope `AUTH`)
- Predefined: CORE, API, UI, DB, CONFIG, AUTH, SEARCH, CHECKOUT, CI, BUILD, ACCESSIBILITY

Examples:

```bash
feat(UI): add dark mode toggle to settings
fix(API): resolve timeout issue in product search
docs(CORE): update adapter pattern documentation
```

Scope is required and must be uppercase, enforced by the commit-msg hook.

## Key Custom Hooks

### useInfiniteData

API-agnostic infinite scroll hook that uses the adapter pattern. Always prefer this over implementing custom infinite queries.

### useInfiniteScroll

Combines `useInfiniteData` with IntersectionObserver for automatic "load more" on scroll. Use `rootMargin` to control when prefetching triggers.

### useDebounce

Debounce rapidly changing values (e.g., search inputs). Default delay is usually 300-500ms for search.

### useKeyboardNavigation

Handles keyboard interactions with focus management, including focus trap and restore. Essential for modals and dialogs.

### useGridNavigation

Grid keyboard navigation with arrow keys. Automatically calculates focus based on grid columns.

## Accessibility Requirements

- All interactive components must support keyboard navigation
- Use `LoadingAnnouncer` for loading states
- Use `SearchAnnouncer` for search results
- All images require alt text (enforced by Biome linter)
- Include ARIA labels where semantic HTML isn't sufficient

## Testing Patterns

Tests use Vitest + React Testing Library. Key patterns:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

For components using TanStack Query, wrap in QueryProvider or use test utilities.

## Styling Guidelines

- Use CSS variables from `src/styles/globals.css` for design tokens
- Dark mode is automatically supported via `prefers-color-scheme` media queries
- CSS custom properties follow naming: `--color-*`, `--spacing-*`, `--radius-*`, `--font-size-*`
- Prefer composition over deeply nested selectors
- Use BEM-like modifier naming: `componentName--modifier` (e.g., `input--error`, `input--sm`)
- CSS module classes are transformed to camelCase in TypeScript (e.g., `input-wrapper` → `inputWrapper`)

## Build & Configuration

- **TypeScript**: Strict mode enabled, uses `@/` path alias
- **Biome**: 120 character line width, double quotes, ES5 trailing commas
- **Node version**: 22.20.0 (managed via Volta if installed)
- **Package manager**: pnpm only (enforced via Volta config)

## Storybook Integration

All shared components should include stories. Stories are automatically detected from `.stories.tsx` files and include:

- Interactive controls for props
- Accessibility testing via a11y addon
- Multiple viewport testing
- Component interaction testing

Run `pnpm storybook` during development to verify component behavior in isolation.
