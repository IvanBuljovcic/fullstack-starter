# Component Library Guide

A collection of production-ready, accessible UI components with full TypeScript support, CSS modules, and Storybook documentation.

---

## Table of Contents

- [Component Principles](#component-principles)
- [Form Components](#form-components)
  - [Input](#input)
  - [Select](#select)
  - [Checkbox](#checkbox)
  - [Radio](#radio)
- [Feedback Components](#feedback-components)
  - [Toast](#toast)
  - [Loader](#loader)
- [Error Handling](#error-handling)
  - [SmartErrorBoundary](#smarterrorboundary)
- [Accessibility Components](#accessibility-components)
  - [LoadingAnnouncer](#loadingannouncer)
  - [SearchAnnouncer](#searchannouncer)
- [Base Components](#base-components)
  - [SelectionInput](#selectioninput)
- [Creating Components](#creating-components)
- [Styling Components](#styling-components)
- [Testing Components](#testing-components)

---

## Component Principles

All components in this library follow these principles:

1. **Accessibility First** - WCAG 2.1 AA compliant
2. **Type Safe** - Full TypeScript with prop validation
3. **Composable** - Can be combined and extended
4. **Tested** - Unit tests with React Testing Library
5. **Documented** - Storybook stories for every component
6. **Styled** - CSS Modules with type-safe selectors

---

## Form Components

### Input

Text input with validation states, sizes, and error messages.

**Location:** `src/components/shared/Input/`

#### Basic Usage

```tsx
import { Input } from '@/components/shared/Input';

function MyForm() {
  return (
    <Input
      label="Email Address"
      type="email"
      placeholder="you@example.com"
      required
    />
  );
}
```

#### Props

```typescript
interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label: string;              // Accessible label (required)
  error?: string;             // Error message to display
  size?: 'sm' | 'md' | 'lg';  // Size variant (default: 'md')
  className?: string;         // Additional CSS classes
}
```

#### Examples

**With Error State:**
```tsx
<Input
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error={errors.username}
/>
```

**Different Sizes:**
```tsx
<Input label="Small" size="sm" />
<Input label="Medium" size="md" />
<Input label="Large" size="lg" />
```

**Password Input:**
```tsx
<Input
  label="Password"
  type="password"
  minLength={8}
  required
/>
```

**Disabled State:**
```tsx
<Input
  label="Readonly Field"
  value="Cannot edit"
  disabled
/>
```

#### Styling

CSS Module: `input.module.css`

Key classes:
- `.input` - Base input styles
- `.input--sm`, `.input--md`, `.input--lg` - Size variants
- `.input--error` - Error state styling
- `.inputWrapper` - Container element
- `.label` - Label element
- `.error` - Error message

---

### Select

Dropdown select component with custom styling and validation.

**Location:** `src/components/shared/Select/`

#### Basic Usage

```tsx
import { Select } from '@/components/shared/Select';

function CategoryFilter() {
  const options = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
  ];

  return (
    <Select
      label="Category"
      options={options}
      placeholder="Select a category"
      onChange={(e) => setCategory(e.target.value)}
    />
  );
}
```

#### Props

```typescript
interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  placeholder?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Examples

**With Groups:**
```tsx
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
  ]}
/>
```

**With Error:**
```tsx
<Select
  label="Payment Method"
  options={paymentMethods}
  error="Please select a payment method"
/>
```

**Controlled Component:**
```tsx
const [value, setValue] = useState('');

<Select
  label="Sort By"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  options={sortOptions}
/>
```

---

### Checkbox

Accessible checkbox component with custom styling.

**Location:** `src/components/shared/Checkbox/`

#### Basic Usage

```tsx
import { Checkbox } from '@/components/shared/Checkbox';

function TermsAgreement() {
  const [agreed, setAgreed] = useState(false);

  return (
    <Checkbox
      label="I agree to the terms and conditions"
      checked={agreed}
      onChange={(e) => setAgreed(e.target.checked)}
    />
  );
}
```

#### Props

```typescript
interface CheckboxProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  className?: string;
}
```

#### Examples

**Multiple Checkboxes:**
```tsx
function FilterOptions() {
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    freeShipping: false,
  });

  return (
    <div>
      <Checkbox
        label="In Stock"
        checked={filters.inStock}
        onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
      />
      <Checkbox
        label="On Sale"
        checked={filters.onSale}
        onChange={(e) => setFilters({ ...filters, onSale: e.target.checked })}
      />
      <Checkbox
        label="Free Shipping"
        checked={filters.freeShipping}
        onChange={(e) => setFilters({ ...filters, freeShipping: e.target.checked })}
      />
    </div>
  );
}
```

**Disabled State:**
```tsx
<Checkbox
  label="This option is disabled"
  disabled
  checked={false}
/>
```

---

### Radio

Radio button component for mutually exclusive options.

**Location:** `src/components/shared/Radio/`

#### Basic Usage

```tsx
import { Radio } from '@/components/shared/Radio';

function ShippingOptions() {
  const [shipping, setShipping] = useState('standard');

  return (
    <div>
      <Radio
        name="shipping"
        value="standard"
        label="Standard Shipping ($5.99)"
        checked={shipping === 'standard'}
        onChange={(e) => setShipping(e.target.value)}
      />
      <Radio
        name="shipping"
        value="express"
        label="Express Shipping ($12.99)"
        checked={shipping === 'express'}
        onChange={(e) => setShipping(e.target.value)}
      />
      <Radio
        name="shipping"
        value="overnight"
        label="Overnight Shipping ($24.99)"
        checked={shipping === 'overnight'}
        onChange={(e) => setShipping(e.target.value)}
      />
    </div>
  );
}
```

#### Props

```typescript
interface RadioProps extends ComponentPropsWithoutRef<'input'> {
  label: string;
  error?: string;
  className?: string;
}
```

#### Important

- Always use the same `name` prop for related radio buttons
- Only one radio in a group can be checked at a time
- Use `value` prop to identify which option was selected

---

## Feedback Components

### Toast

Global notification system with queue management.

**Location:** `src/components/shared/Toast/`

#### Setup

First, add the `ToastProvider` to your app layout:

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/shared/Toast';

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

#### Basic Usage

```tsx
import { useToast } from '@/components/shared/Toast';

function SaveButton() {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      showToast({
        message: 'Saved successfully!',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      showToast({
        message: 'Failed to save',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

#### Types

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;        // Auto-dismiss time (default: 3000ms)
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

#### Examples

**Success Toast:**
```tsx
showToast({
  message: 'Product added to cart',
  type: 'success',
});
```

**Error Toast:**
```tsx
showToast({
  message: 'Failed to process payment',
  type: 'error',
  duration: 5000,
});
```

**Warning Toast:**
```tsx
showToast({
  message: 'Your session will expire soon',
  type: 'warning',
});
```

**Info Toast:**
```tsx
showToast({
  message: 'New features available!',
  type: 'info',
});
```

**With Action Button:**
```tsx
showToast({
  message: 'Item deleted',
  type: 'success',
  action: {
    label: 'Undo',
    onClick: () => restoreItem(),
  },
});
```

#### Features

- ✅ Queue management (multiple toasts stack)
- ✅ Auto-dismiss with configurable duration
- ✅ Action buttons (undo, retry, etc.)
- ✅ Keyboard accessible (Escape to dismiss)
- ✅ Screen reader announcements

---

### Loader

Simple loading spinner component.

**Location:** `src/components/shared/Loader/`

#### Basic Usage

```tsx
import { Loader } from '@/components/shared/Loader';

function LoadingState() {
  return (
    <div>
      <Loader />
      <p>Loading products...</p>
    </div>
  );
}
```

#### Props

```typescript
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';  // Size variant (default: 'md')
  className?: string;
}
```

#### Examples

**Different Sizes:**
```tsx
<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />
```

**Centered:**
```tsx
<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
  <Loader />
</div>
```

**With Message:**
```tsx
<div className={styles.loadingContainer}>
  <Loader size="lg" />
  <p className={styles.loadingText}>Fetching your data...</p>
</div>
```

---

## Error Handling

### SmartErrorBoundary

Multi-level error boundary with retry logic.

**Location:** `src/components/SmartErrorBoundary/`

#### Basic Usage

```tsx
import { SmartErrorBoundary } from '@/components/SmartErrorBoundary';

function App() {
  return (
    <SmartErrorBoundary context="App" level="app">
      <MainContent />
    </SmartErrorBoundary>
  );
}
```

#### Props

```typescript
interface SmartErrorBoundaryProps {
  children: ReactNode;
  context: string;                          // Error context name
  level: 'component' | 'page' | 'app';     // Error boundary level
  maxRetries?: number;                      // Max retry attempts (default: 3)
  onError?: (error: Error) => void;        // Error callback
}
```

#### Levels

**Component Level** - Local errors with basic retry:
```tsx
<SmartErrorBoundary context="ProductList" level="component" maxRetries={3}>
  <ProductList />
</SmartErrorBoundary>
```

**Page Level** - Page errors with navigation:
```tsx
<SmartErrorBoundary context="CheckoutPage" level="page">
  <CheckoutPage />
</SmartErrorBoundary>
```

**App Level** - Critical errors with full reload:
```tsx
<SmartErrorBoundary context="Application" level="app">
  <App />
</SmartErrorBoundary>
```

#### Features by Level

| Level | Features |
|-------|----------|
| `component` | Retry button, error details |
| `page` | Everything in component + back/home navigation |
| `app` | Everything in page + full app reload option |

#### Example: Form with Error Boundary

```tsx
function SignupForm() {
  return (
    <SmartErrorBoundary
      context="SignupForm"
      level="component"
      maxRetries={2}
      onError={(error) => {
        console.error('Signup error:', error);
        analytics.track('signup_error', { error: error.message });
      }}
    >
      <SignupFormContent />
    </SmartErrorBoundary>
  );
}
```

---

## Accessibility Components

### LoadingAnnouncer

Screen reader announcements for loading states.

**Location:** `src/components/Accessibility/Announcer/Loading/`

#### Basic Usage

```tsx
import { LoadingAnnouncer } from '@/components/Accessibility/Announcer/Loading';

function ProductList() {
  const { data, isFetching } = useQuery({...});

  return (
    <div>
      <LoadingAnnouncer
        isLoading={isFetching}
        message="Loading products"
      />
      {/* Product content */}
    </div>
  );
}
```

#### Props

```typescript
interface LoadingAnnouncerProps {
  isLoading: boolean;
  message?: string;  // Default: "Loading"
}
```

---

### SearchAnnouncer

Screen reader announcements for search results.

**Location:** `src/components/Accessibility/Announcer/Search/`

#### Basic Usage

```tsx
import { SearchAnnouncer } from '@/components/Accessibility/Announcer/Search';

function SearchResults({ results }) {
  return (
    <div>
      <SearchAnnouncer
        count={results.length}
        query={searchQuery}
      />
      {results.map(result => (
        <SearchResult key={result.id} result={result} />
      ))}
    </div>
  );
}
```

#### Props

```typescript
interface SearchAnnouncerProps {
  count: number;
  query: string;
}
```

---

## Base Components

### SelectionInput

Base component for Checkbox and Radio components. Not typically used directly.

**Location:** `src/components/shared/SelectionInput/`

**Purpose:** Shared logic and styling for selection inputs to reduce duplication.

#### When to Use

- ✅ Creating new selection-based components
- ❌ Building forms (use Checkbox or Radio instead)

---

## Creating Components

### Using the Generator

```bash
cd web
pnpm generate MyComponent --client --styles --props "title: string; count: number"
```

This creates:
```
src/components/MyComponent/
├── index.ts
├── my-component.tsx
└── my-component.module.css
```

### Manual Creation

**1. Create component file:**

```tsx
// my-component.tsx
"use client";  // If using client-side features

import type { ComponentPropsWithoutRef } from 'react';
import styles from './my-component.module.css';

interface MyComponentProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  count?: number;
}

export function MyComponent({
  title,
  count = 0,
  className,
  ...props
}: MyComponentProps) {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.count}>Count: {count}</p>
    </div>
  );
}
```

**2. Create styles:**

```css
/* my-component.module.css */
.container {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.count {
  color: var(--color-text-secondary);
}
```

**3. Create barrel export:**

```ts
// index.ts
export { MyComponent } from './my-component';
export type { MyComponentProps } from './my-component';
```

**4. Create Storybook story:**

```tsx
// my-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './my-component';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    title: 'Hello World',
    count: 42,
  },
};
```

**5. Create test:**

```tsx
// my-component.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('displays count', () => {
    render(<MyComponent title="Test" count={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
});
```

---

## Styling Components

### CSS Module Pattern

```tsx
import styles from './component.module.css';

// Basic usage
<div className={styles.container} />

// With multiple classes
<div className={`${styles.container} ${styles.active}`} />

// Conditional classes
<div className={`${styles.button} ${isActive ? styles['button--active'] : ''}`} />
```

### Using clsx for Conditional Classes

```tsx
import clsx from 'clsx';
import styles from './button.module.css';

function Button({ variant, size, disabled }) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        disabled && styles['button--disabled']
      )}
    >
      Click me
    </button>
  );
}
```

### Type-Safe Selectors

```tsx
import { createStrictClassSelector } from '@/lib/class-selectors';
import styles from './component.module.css';

const css = createStrictClassSelector(styles);

// TypeScript will error if class doesn't exist
<div className={css('container', 'active')} />
```

---

## Testing Components

### Basic Test

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });
});
```

### User Interaction Test

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('calls onChange when clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Checkbox
        label="Accept terms"
        checked={false}
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
```

### Accessibility Test

```tsx
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Input } from './input';

it('has no accessibility violations', async () => {
  const { container } = render(<Input label="Email" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Component Checklist

When creating a new component, ensure:

- [ ] TypeScript props with proper types
- [ ] Extends native HTML props when applicable
- [ ] Uses forwardRef if ref forwarding needed
- [ ] CSS Module for styling
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Storybook story with examples
- [ ] Unit tests with React Testing Library
- [ ] Barrel export (index.ts)
- [ ] JSDoc comments for complex props
- [ ] Responsive design
- [ ] Dark mode support (if applicable)

---

## Related Documentation

- [Hooks Guide](./HOOKS.md) - Using hooks in components
- [Styling System](./STYLING.md) - CSS patterns and utilities
- [Testing Guide](./TESTING.md) - Comprehensive testing guide
- [Storybook](../README.md#storybook) - Component documentation

---

## Storybook

View all components interactively:

```bash
pnpm storybook
# Opens at http://localhost:6006
```

**Features:**
- Interactive prop controls
- Accessibility testing (a11y addon)
- Responsive viewport testing
- Dark mode testing
- Copy code snippets
