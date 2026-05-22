# Testing Guide

This guide covers all testing approaches used in this Next.js application, including unit testing with Vitest, component testing with React Testing Library, visual testing with Storybook, and E2E testing with Playwright.

---

## Table of Contents

- [Overview](#overview)
- [Unit Testing with Vitest](#unit-testing-with-vitest)
- [Component Testing with React Testing Library](#component-testing-with-react-testing-library)
- [Testing Custom Hooks](#testing-custom-hooks)
- [Testing with Adapters](#testing-with-adapters)
- [Visual Testing with Storybook](#visual-testing-with-storybook)
- [E2E Testing with Playwright](#e2e-testing-with-playwright)
- [Testing Best Practices](#testing-best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

### Testing Stack

| Type                | Tool                  | Purpose                                       |
| ------------------- | --------------------- | --------------------------------------------- |
| **Unit Tests**      | Vitest                | Fast, isolated tests for functions and hooks  |
| **Component Tests** | React Testing Library | User-centric component behavior tests         |
| **Visual Tests**    | Storybook             | Component documentation and visual regression |
| **E2E Tests**       | Playwright            | Full user journey testing                     |

### Running Tests

```bash
# Unit tests (watch mode)
pnpm test

# Unit tests with UI
pnpm test:ui

# Coverage report
pnpm test:coverage

# Run tests for a specific file
pnpm test src/components/shared/Input/input.test.tsx

# E2E tests
pnpm nx e2e web-e2e

# Storybook (visual tests)
pnpm storybook
```

---

## Unit Testing with Vitest

### Configuration

Vitest is configured in `vitest.config.ts`:

```ts
// vitest.config.ts
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

**Key features:**

- `globals: true` - No need to import `describe`, `it`, `expect`
- `environment: 'jsdom'` - Browser-like environment
- `setupFiles` - Loads `@testing-library/jest-dom` matchers

### Setup File

```ts
// vitest.setup.ts
import '@testing-library/jest-dom';
```

This provides helpful matchers like:

- `toBeInTheDocument()`
- `toHaveTextContent()`
- `toBeDisabled()`
- `toHaveClass()`

### Basic Test Structure

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Organizing Tests

Group related tests using nested `describe` blocks:

```tsx
describe('Input', () => {
  describe('Basic Rendering', () => {
    it('should render input element', () => {
      /* ... */
    });
    it('should render with label', () => {
      /* ... */
    });
  });

  describe('Size Variants', () => {
    it('should render with small size', () => {
      /* ... */
    });
    it('should render with large size', () => {
      /* ... */
    });
  });

  describe('User Interactions', () => {
    it('should handle onChange event', () => {
      /* ... */
    });
    it('should handle onBlur event', () => {
      /* ... */
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input', () => {
      /* ... */
    });
    it('should have aria-invalid when error exists', () => {
      /* ... */
    });
  });
});
```

---

## Component Testing with React Testing Library

### Core Principles

React Testing Library encourages testing components **the way users interact with them**:

1. **Query by role, label, or text** (not by implementation details)
2. **Test behavior, not implementation**
3. **Prefer user interactions over state inspection**

### Querying Elements

**Priority order (best to worst):**

```tsx
// 1. Role queries (BEST - most accessible)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('textbox', { name: /email/i });
screen.getByRole('checkbox', { name: /agree/i });

// 2. Label queries
screen.getByLabelText('Email Address');

// 3. Placeholder queries
screen.getByPlaceholderText('Enter email');

// 4. Text queries
screen.getByText(/hello world/i);

// 5. Test ID (LAST RESORT)
screen.getByTestId('submit-button');
```

### Query Variants

```tsx
// getBy* - Throws error if not found (use for assertions)
const button = screen.getByRole('button');

// queryBy* - Returns null if not found (use for non-existence checks)
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// findBy* - Returns promise (use for async elements)
const message = await screen.findByText('Success!');

// *AllBy* - Returns array
const buttons = screen.getAllByRole('button');
```

### Testing User Interactions

Always use `userEvent` instead of `fireEvent` for realistic interactions:

```tsx
import userEvent from '@testing-library/user-event';

it('should handle user typing', async () => {
  const user = userEvent.setup();
  render(<Input />);
  const input = screen.getByRole('textbox');

  await user.type(input, 'hello world');

  expect(input).toHaveValue('hello world');
});

it('should handle click events', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('should handle keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<Form />);

  await user.tab(); // Focus first element
  await user.keyboard('{Enter}'); // Press Enter
  await user.tab(); // Move to next element
});
```

### Testing Component States

```tsx
describe('Input States', () => {
  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should have error styling when error is provided', () => {
    render(<Input error="Invalid" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input--error');
  });

  it('should have aria-invalid when error exists', () => {
    render(<Input error="Invalid email" label="Email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });
});
```

### Testing Controlled Components

```tsx
it('should work as controlled component', async () => {
  const user = userEvent.setup();

  const TestComponent = () => {
    const [value, setValue] = React.useState('');
    return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
  };

  render(<TestComponent />);
  const input = screen.getByRole('textbox');

  await user.type(input, 'controlled');

  expect(input).toHaveValue('controlled');
});
```

### Testing Accessibility

```tsx
describe('Accessibility', () => {
  it('should associate label with input', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should have aria-describedby for error messages', () => {
    render(<Input error="Invalid email" label="Email" />);
    const input = screen.getByLabelText('Email');
    const errorId = input.getAttribute('aria-describedby');

    expect(screen.getByText('Invalid email')).toHaveAttribute('id', errorId);
  });

  it('should have role alert on error message', () => {
    render(<Input error="Invalid" label="Email" />);
    expect(screen.getByText('Invalid')).toHaveAttribute('role', 'alert');
  });
});
```

### Mocking Functions

Use Vitest's `vi.fn()` to create mock functions:

```tsx
import { vi } from 'vitest';

it('should call onChange when user types', async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();

  render(<Input onChange={handleChange} />);

  await user.type(screen.getByRole('textbox'), 'test');

  expect(handleChange).toHaveBeenCalled();
  expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
});
```

### Testing Async Behavior

```tsx
it('should show success message after submission', async () => {
  const user = userEvent.setup();
  render(<Form />);

  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Use findBy* for elements that appear asynchronously
  expect(await screen.findByText('Success!')).toBeInTheDocument();
});

it('should debounce search input', async () => {
  const user = userEvent.setup();
  const handleSearch = vi.fn();

  render(<SearchInput onSearch={handleSearch} debounce={300} />);

  await user.type(screen.getByRole('searchbox'), 'query');

  // Wait for debounce
  await waitFor(
    () => {
      expect(handleSearch).toHaveBeenCalledWith('query');
    },
    { timeout: 400 }
  );
});
```

---

## Testing Custom Hooks

### Using `renderHook`

Test hooks in isolation using `@testing-library/react`'s `renderHook`:

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDebounce } from './use-debounce';

describe('useDebounce', () => {
  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 300 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Wait for debounce
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 400 }
    );
  });
});
```

### Testing Hooks with Context

Wrap hooks that require providers:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useInfiniteData', () => {
  it('should fetch data using adapter', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () =>
        useInfiniteData({
          queryKey: ['products'],
          adapter: mockAdapter,
          fetcher: mockFetcher,
          filters: {},
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Testing State Updates in Hooks

```tsx
import { act } from '@testing-library/react';

it('should update state when calling toggle', () => {
  const { result } = renderHook(() => useToggle(false));

  expect(result.current.value).toBe(false);

  act(() => {
    result.current.toggle();
  });

  expect(result.current.value).toBe(true);
});
```

---

## Testing with Adapters

The adapter pattern makes testing API integrations straightforward by swapping real adapters with mocks.

### Creating Mock Adapters

```tsx
// test-utils/mock-adapter.ts
import type { DataAdapter, ParsedPage } from '@/adapters/data-adapter';

export class MockProductAdapter
  implements DataAdapter<Product, ProductFilters, any, number>
{
  limit = 20;

  buildURL(filters: ProductFilters, pageParam: number): string {
    return `/api/products?page=${pageParam}`;
  }

  parseResponse(response: any): ParsedPage<Product> {
    return {
      items: [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ],
      total: 2,
      hasNextPage: false,
    };
  }

  getNextPageParam(
    lastPage: ParsedPage<Product>,
    allPages: ParsedPage<Product>[]
  ): number | undefined {
    return lastPage.hasNextPage ? allPages.length + 1 : undefined;
  }
}
```

### Testing Components with Adapters

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MockProductAdapter } from '@/test-utils/mock-adapter';

describe('ProductList', () => {
  it('should render products from adapter', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const mockAdapter = new MockProductAdapter();

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList adapter={mockAdapter} />
      </QueryClientProvider>
    );

    expect(await screen.findByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });
});
```

### Mocking Fetchers

```tsx
import { vi } from 'vitest';

const mockFetcher = vi.fn().mockResolvedValue({
  data: [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ],
  pagination: {
    total: 2,
    hasMore: false,
  },
});

it('should call fetcher with correct URL', async () => {
  render(<ComponentWithFetcher fetcher={mockFetcher} />);

  await waitFor(() => {
    expect(mockFetcher).toHaveBeenCalledWith('/api/items?page=1');
  });
});
```

---

## Visual Testing with Storybook

### What is Storybook?

Storybook provides:

- **Component documentation** - Interactive examples
- **Visual testing** - See components in isolation
- **Accessibility testing** - Built-in a11y addon
- **Responsive testing** - Test different viewports

### Running Storybook

```bash
pnpm storybook     # Start on http://localhost:6006
pnpm build-storybook  # Build static site
```

### Writing Stories

Stories are defined in `.stories.tsx` files:

```tsx
// button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

// Variant stories
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary button',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small button',
  },
};
```

### Interactive Stories

Create stories with state and interactions:

```tsx
import { useState } from 'react';

const FormExample = () => {
  const [value, setValue] = useState('');

  return (
    <div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        label="Email"
      />
      <p>Current value: {value}</p>
    </div>
  );
};

export const WithState: Story = {
  render: () => <FormExample />,
};
```

### Testing Accessibility in Storybook

Storybook includes the a11y addon for accessibility testing:

1. Open any story
2. Click "Accessibility" tab
3. Review violations and warnings
4. Fix issues in your component

### Responsive Testing

Use the viewport toolbar to test different screen sizes:

1. Click viewport icon in toolbar
2. Select preset (iPhone, iPad, Desktop)
3. Or enter custom dimensions

---

## E2E Testing with Playwright

E2E tests are in the `web-e2e` directory and test the full application from a user's perspective.

### Configuration

```ts
// web-e2e/playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm nx serve web',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Writing E2E Tests

```ts
// web-e2e/src/example.spec.ts
import { test, expect } from '@playwright/test';

test('should navigate to about page', async ({ page }) => {
  await page.goto('/');

  await page.click('text=About');

  await expect(page).toHaveURL('/about');
  await expect(page.locator('h1')).toHaveText('About Us');
});

test('should submit contact form', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('textarea[name="message"]', 'Hello world');
  await page.click('button[type="submit"]');

  await expect(page.locator('.success-message')).toBeVisible();
});
```

### Running E2E Tests

```bash
# Run all E2E tests
pnpm nx e2e web-e2e

# Run specific browser
pnpm nx e2e web-e2e --project=chromium

# Run in UI mode (debug)
pnpm nx e2e web-e2e --ui

# Run in headed mode (see browser)
pnpm nx e2e web-e2e --headed
```

---

## Testing Best Practices

### 1. Follow Testing Trophy

```
           /\
          /  \
         /E2E \       ← Few (critical user journeys)
        /------\
       /  Integ \     ← Some (feature testing)
      /----------\
     / Component \    ← Many (component behavior)
    /--------------\
   /     Unit       \ ← Most (pure functions, utilities)
  /------------------\
```

### 2. Test Behavior, Not Implementation

```tsx
// ❌ Bad - Tests implementation
it('should set state to true when calling toggle', () => {
  const component = new Component();
  component.toggle();
  expect(component.state.isOpen).toBe(true);
});

// ✅ Good - Tests behavior
it('should show menu when toggle button is clicked', async () => {
  const user = userEvent.setup();
  render(<Component />);

  await user.click(screen.getByRole('button', { name: /toggle menu/i }));

  expect(screen.getByRole('menu')).toBeVisible();
});
```

### 3. Use Accessible Queries

```tsx
// ❌ Bad - Fragile, not accessible
screen.getByTestId('submit-button');
container.querySelector('.btn-primary');

// ✅ Good - Accessible, semantic
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email Address');
```

### 4. Don't Test Third-Party Libraries

```tsx
// ❌ Bad - Testing React Hook Form
it('should validate using Zod schema', () => {
  // Testing library internals
});

// ✅ Good - Test your integration
it('should show error when email is invalid', async () => {
  render(<Form />);
  // Test your form's behavior
});
```

### 5. Keep Tests Isolated

```tsx
// ❌ Bad - Shared state between tests
let user: User;

beforeAll(() => {
  user = { id: '1', name: 'John' };
});

it('test 1', () => {
  user.name = 'Jane'; // Mutates shared state
});

// ✅ Good - Fresh state per test
it('test 1', () => {
  const user = { id: '1', name: 'John' };
  // Test uses local state
});
```

### 6. Use Descriptive Test Names

```tsx
// ❌ Bad
it('works', () => {});
it('test button', () => {});

// ✅ Good
it('should disable submit button when form is invalid', () => {});
it('should show error message when email format is incorrect', () => {});
```

### 7. Test Edge Cases

```tsx
describe('Input', () => {
  // Happy path
  it('should accept valid email', () => {});

  // Edge cases
  it('should handle empty value', () => {});
  it('should handle very long input', () => {});
  it('should handle special characters', () => {});
  it('should handle rapid typing', () => {});
});
```

### 8. Use Test Utilities

Create reusable test utilities:

```tsx
// test-utils/render-with-providers.tsx
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

// Usage
renderWithProviders(<MyComponent />);
```

### 9. Mock External Dependencies

```tsx
import { vi } from 'vitest';

// Mock API calls
vi.mock('@/lib/api-client', () => ({
  fetcher: vi.fn().mockResolvedValue({ data: [] }),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
  }),
}));
```

### 10. Clean Up After Tests

```tsx
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup(); // Automatically done by RTL
  vi.clearAllMocks(); // Clear mock call history
});
```

---

## Troubleshooting

### Common Issues

#### "Cannot find module '@/...'"

**Cause**: Path alias not configured for tests

**Fix**: Ensure `vitest.config.ts` has the correct alias:

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

#### "Not wrapped in act(...)"

**Cause**: State updates not wrapped properly

**Fix**: Use `await` with `userEvent` or wrap in `act()`:

```tsx
// ✅ Good
await user.click(button);

// ✅ Good
import { act } from '@testing-library/react';
act(() => {
  result.current.toggle();
});
```

#### "Unable to find element"

**Cause**: Element not rendered or query incorrect

**Fix**: Use `screen.debug()` to inspect DOM:

```tsx
render(<Component />);
screen.debug(); // Prints entire DOM
screen.debug(screen.getByRole('button')); // Prints specific element
```

#### Tests pass locally but fail in CI

**Cause**: Timing issues or environment differences

**Fix**:

- Use `waitFor` for async operations
- Increase timeout for slow operations
- Check for timezone/locale issues

```tsx
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  },
  { timeout: 5000 }
);
```

#### "querySelector is not a function"

**Cause**: Testing server components in client test environment

**Fix**: Mark component as `'use client'` or test in different environment

---

## Summary

**Testing Philosophy:**

1. **Write tests that give you confidence** - Not 100% coverage
2. **Test like a user** - Use accessible queries, real interactions
3. **Keep tests maintainable** - Avoid testing implementation details
4. **Fast feedback loop** - Unit tests should be instant

**Coverage Targets:**

- **Unit tests**: Pure functions, utilities, hooks
- **Component tests**: User interactions, states, accessibility
- **Integration tests**: Multiple components working together
- **E2E tests**: Critical user journeys only

**Next Steps:**

- Review existing test files for patterns
- Add tests for new components
- Run tests before committing (enforced by git hooks)
- See [COMPONENTS.md](./COMPONENTS.md) for component examples
- See [HOOKS.md](./HOOKS.md) for hook usage
- See [WEB.md](../docs/WEB.md) for full development guide
