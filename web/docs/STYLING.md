# Styling System Guide

This guide covers the styling architecture used in this Next.js application, including CSS Modules, design tokens, utility classes, and best practices.

---

## Table of Contents

- [Overview](#overview)
- [CSS Modules](#css-modules)
- [Design Tokens (CSS Custom Properties)](#design-tokens-css-custom-properties)
- [Utility Classes](#utility-classes)
- [Type Safety with TypeScript](#type-safety-with-typescript)
- [Dark Mode Support](#dark-mode-support)
- [Component Styling Patterns](#component-styling-patterns)
- [PostCSS Configuration](#postcss-configuration)
- [Best Practices](#best-practices)
- [Migration from Other Systems](#migration-from-other-systems)

---

## Overview

The styling system is built on three pillars:

1. **CSS Modules** - Scoped, component-level styles
2. **CSS Custom Properties** - Global design tokens in `globals.css`
3. **Utility Classes** - Common patterns in `utilities.module.css`

This architecture provides:
- Type safety with TypeScript autocomplete
- Automatic dark mode support
- No runtime CSS-in-JS overhead
- Easy theming and customization
- Clear separation of concerns

---

## CSS Modules

### What Are CSS Modules?

CSS Modules automatically scope CSS to components, preventing style conflicts. Class names are transformed at build time to be unique.

```tsx
// input.tsx
import styles from './input.module.css';

<input className={styles.input} />
```

```css
/* input.module.css */
.input {
  padding: 1rem;
}

/* Becomes something like: .input__a7b3c2 { padding: 1rem; } */
```

### Naming Convention

Use **BEM-like modifiers** for variants:

```css
/* Base class */
.componentName { }

/* Modifiers (use double dash) */
.componentName--variant { }
.componentName--state { }

/* Child elements (use camelCase) */
.componentNameHeader { }
.componentNameBody { }
```

**Examples:**

```css
/* input.module.css */
.input { }
.input--sm { }
.input--md { }
.input--lg { }
.input--error { }
.input--disabled { }
.inputWrapper { }
.errorText { }
```

### Dynamic Class Names

Use `clsx` for conditional and dynamic class composition:

```tsx
import clsx from 'clsx';
import styles from './input.module.css';

const className = clsx(
  styles.input,                              // Base class
  styles[`input--${size}`],                  // Dynamic variant
  error && styles['input--error'],            // Conditional state
  disabled && styles['input--disabled'],      // Another condition
  className,                                  // Pass-through prop
);
```

**Why bracket notation?**
- Modifiers use dashes (`input--error`)
- Dashes can't be used in dot notation
- Use `styles['input--error']` or `styles[`input--${variant}`]`

### TypeScript Integration

The `typescript-plugin-css-modules` plugin provides:
- Autocomplete for CSS class names
- Type errors for invalid classes
- camelCase transformation for class names

```tsx
import styles from './component.module.css';

// ✅ Autocomplete works
styles.componentName

// ✅ Dashes converted to camelCase
styles.componentNameWrapper  // matches .componentName-wrapper

// ❌ TypeScript error for non-existent class
styles.nonExistentClass
```

**Configuration** (in `tsconfig.json`):

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-plugin-css-modules",
        "options": {
          "classnameTransform": "camelCase",
          "customMatcher": "\\.module\\.(c|le|sc|sa)ss$"
        }
      }
    ]
  }
}
```

---

## Design Tokens (CSS Custom Properties)

All design tokens are defined in `src/styles/globals.css` as CSS custom properties (variables). This provides a single source of truth for your design system.

### Color System

```css
:root {
  /* Brand Colors */
  --color-primary: hsl(210, 60%, 75%);
  --color-primary-hover: hsl(210, 60%, 65%);
  --color-secondary: hsl(270, 50%, 77%);
  --color-accent: hsl(340, 70%, 82%);

  /* Semantic Colors */
  --color-success: hsl(160, 50%, 75%);
  --color-warning: hsl(45, 70%, 78%);
  --color-error: hsl(0, 65%, 82%);
  --color-info: hsl(200, 60%, 80%);

  /* Background Colors */
  --color-background: hsl(45, 55%, 96%);
  --color-surface: hsl(0, 0%, 100%);
  --color-surface-alt: hsl(210, 40%, 98%);

  /* Text Colors */
  --color-text-primary: hsl(220, 15%, 25%);
  --color-text-secondary: hsl(220, 10%, 45%);
  --color-text-tertiary: hsl(220, 8%, 60%);
  --color-text-inverse: hsl(0, 0%, 100%);

  /* Border Colors */
  --color-border: hsl(220, 15%, 88%);
  --color-border-light: hsl(220, 10%, 93%);
  --color-border-focus: var(--color-primary);
}
```

### Spacing Scale

```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
}
```

### Typography Scale

```css
:root {
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Fully rounded */
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px hsla(220, 15%, 25%, 0.06);
  --shadow-md: 0 2px 4px hsla(220, 15%, 25%, 0.08);
  --shadow-lg: 0 4px 8px hsla(220, 15%, 25%, 0.1);
  --shadow-xl: 0 8px 16px hsla(220, 15%, 25%, 0.12);
  --shadow-focus: 0 0 0 3px hsla(210, 60%, 75%, 0.3);
}
```

### Z-Index Scale

```css
:root {
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

### Transitions

```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}
```

### Using Design Tokens

Always reference design tokens in your CSS modules:

```css
/* ✅ Good - Uses design tokens */
.button {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  background-color: var(--color-primary);
  transition: background-color var(--transition-fast);
}

/* ❌ Bad - Hardcoded values */
.button {
  padding: 16px 24px;
  font-size: 16px;
  border-radius: 8px;
  color: #333;
  background-color: #a8c5e3;
}
```

---

## Utility Classes

Common patterns are provided in `src/styles/utilities.module.css`. Import and use them for quick styling without writing custom CSS.

### Layout Utilities

```tsx
import utils from '@/styles/utilities.module.css';

// Flexbox
<div className={utils.flex}>
<div className={utils.flexCol}>
<div className={clsx(utils.flex, utils.itemsCenter, utils.justifyBetween)}>

// Grid
<div className={utils.grid}>

// Positioning
<div className={utils.relative}>
<div className={utils.absolute}>
<div className={utils.fixed}>
```

### Spacing Utilities

```tsx
// Margin
<div className={utils.mmd}>      {/* margin: var(--spacing-md) */}
<div className={utils.mtlg}>     {/* margin-top: var(--spacing-lg) */}

// Padding
<div className={utils.pmd}>      {/* padding: var(--spacing-md) */}
<div className={utils.ptlg}>     {/* padding-top: var(--spacing-lg) */}
```

### Typography Utilities

```tsx
// Font sizes
<p className={utils.textSm}>
<h2 className={utils.text3xl}>

// Font weights
<span className={utils.fontBold}>
<p className={utils.fontMedium}>

// Text alignment
<div className={utils.textCenter}>
```

### Color Utilities

```tsx
// Text colors
<p className={utils.textPrimary}>
<span className={utils.textSecondary}>

// Background colors
<div className={utils.bgPrimary}>
<div className={utils.bgSurface}>
```

### Sizing Utilities

```tsx
// Full width/height
<div className={utils.wFull}>
<div className={utils.hFull}>

// Viewport sizing
<div className={utils.wScreen}>
<div className={utils.hScreen}>
```

### Border Radius Utilities

```tsx
<div className={utils.roundedMd}>
<div className={utils.roundedLg}>
<div className={utils.roundedFull}>
```

### Shadow Utilities

```tsx
<div className={utils.shadowCard}>
<div className={utils.shadowDropdown}>
```

### Responsive Utilities

```tsx
// Show on small screens and up
<div className={utils.smFlex}>

// Hide on medium screens and up
<div className={utils.mdHidden}>

// Show as block on large screens
<div className={utils.lgBlock}>
```

### Combining Utilities with Component Styles

```tsx
import clsx from 'clsx';
import styles from './component.module.css';
import utils from '@/styles/utilities.module.css';

<div className={clsx(
  styles.container,
  utils.flex,
  utils.flexCol,
  utils.itemsCenter,
  utils.pmd
)}>
```

---

## Type Safety with TypeScript

### Type-Safe Class Selectors

For additional runtime validation in development, use `createStrictClassSelector`:

```tsx
import { createStrictClassSelector } from '@/lib/class-selectors';
import styles from './component.module.css';

const getClass = createStrictClassSelector(styles, 'ComponentName');

// ✅ Valid class
getClass('input')

// ❌ Runtime warning in development for invalid class
getClass('invalidClass')
```

**When to use:**
- Building reusable component libraries
- When you want extra safety during development
- Complex components with many variants

**When to skip:**
- Simple components
- You prefer compile-time checking only
- Performance-critical code (adds small overhead)

### CSS Module Type Definitions

The `typescript-plugin-css-modules` automatically generates type definitions for your CSS modules:

```tsx
// Auto-generated types from input.module.css
type Styles = {
  input: string;
  inputWrapper: string;
  'input--sm': string;      // Dashes preserved in types
  'input--error': string;
  errorText: string;
};
```

Access with bracket notation for dashed names:

```tsx
styles['input--sm']
styles['input--error']
```

Or camelCase (if enabled):

```tsx
styles.inputSm
styles.inputError
```

---

## Dark Mode Support

Dark mode is automatically supported via the `prefers-color-scheme` media query.

### How It Works

1. Define light theme tokens in `:root`
2. Override tokens in `@media (prefers-color-scheme: dark)`
3. Components automatically adapt

```css
/* globals.css */
:root {
  --color-background: hsl(45, 55%, 96%);
  --color-text-primary: hsl(220, 15%, 25%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: hsl(220, 15%, 12%);
    --color-text-primary: hsl(220, 15%, 92%);
  }
}
```

### Component-Specific Dark Mode Styles

For component-specific adjustments:

```css
/* component.module.css */
.component {
  background: var(--color-background);
  color: var(--color-text-primary);
}

@media (prefers-color-scheme: dark) {
  .component {
    /* Additional dark mode styles if needed */
    border-color: hsl(220, 15%, 25%);
  }
}
```

### Testing Dark Mode

**In Browser:**
1. Open DevTools → Rendering tab
2. Find "Emulate CSS media feature prefers-color-scheme"
3. Select "dark"

**In Storybook:**
Storybook's toolbar includes a theme toggle for testing both modes.

---

## Component Styling Patterns

### Basic Component

```tsx
// button.tsx
'use client';

import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './button.module.css';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

```css
/* button.module.css */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

/* Variants */
.button--primary {
  background-color: var(--color-primary);
  color: var(--color-button-text);
}

.button--primary:hover {
  background-color: var(--color-primary-hover);
}

.button--secondary {
  background-color: var(--color-secondary);
  color: var(--color-button-text);
}

/* Sizes */
.button--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.button--md {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
}

.button--lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-lg);
}

/* States */
.button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: var(--color-button-disabled);
}

.button:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

### Component with Utilities

```tsx
import clsx from 'clsx';
import styles from './card.module.css';
import utils from '@/styles/utilities.module.css';

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        styles.card,
        utils.pmd,           // padding-md
        utils.roundedLg,     // border-radius
        utils.shadowCard,    // box-shadow
        className,
      )}
    >
      {children}
    </div>
  );
}
```

### Complex Component with Multiple Elements

```tsx
// select.tsx
<div className={styles.selectWrapper}>
  <label className={styles.label}>
    {label}
  </label>
  <select
    className={clsx(
      styles.select,
      styles[`select--${size}`],
      error && styles['select--error'],
    )}
  >
    {children}
  </select>
  {error && (
    <span className={styles.errorText}>{error}</span>
  )}
</div>
```

```css
/* select.module.css */
.selectWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}

.select--error {
  border-color: var(--color-error);
}

.errorText {
  font-size: var(--font-size-sm);
  color: var(--color-error);
}
```

---

## PostCSS Configuration

The project uses PostCSS with two plugins:

```js
// postcss.config.mjs
const config = {
  plugins: {
    'postcss-custom-media': {},  // Custom media queries
    autoprefixer: {},             // Browser prefixes
  },
};
```

### Custom Media Queries

Define reusable media queries:

```css
/* globals.css */
@custom-media --viewport-sm (min-width: 640px);
@custom-media --viewport-md (min-width: 768px);
@custom-media --viewport-lg (min-width: 1024px);
```

Use them:

```css
.component {
  width: 100%;
}

@media (--viewport-md) {
  .component {
    width: 50%;
  }
}
```

### Autoprefixer

Automatically adds vendor prefixes based on your browserslist configuration:

```css
/* You write: */
.box {
  display: flex;
}

/* Autoprefixer outputs: */
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

---

## Best Practices

### 1. Always Use Design Tokens

```css
/* ✅ Good */
.component {
  color: var(--color-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* ❌ Bad */
.component {
  color: #333;
  padding: 16px;
  border-radius: 8px;
}
```

### 2. Use Semantic Token Names

```css
/* ✅ Good - Semantic meaning */
--color-error
--color-success
--color-text-primary

/* ❌ Bad - Implementation details */
--color-red
--color-green
--color-gray-900
```

### 3. Prefer Composition Over Nesting

```css
/* ✅ Good - Flat structure */
.card { }
.cardHeader { }
.cardBody { }
.cardFooter { }

/* ❌ Bad - Deep nesting */
.card { }
.card .header { }
.card .body { }
.card .body .content { }
```

### 4. Use BEM-Like Modifiers

```css
/* ✅ Good */
.button { }
.button--primary { }
.button--large { }
.button--disabled { }

/* ❌ Bad */
.button { }
.primary { }
.large { }
.disabled { }
```

### 5. Keep Specificity Low

```css
/* ✅ Good - Low specificity */
.button { }
.button--primary { }

/* ❌ Bad - High specificity */
div.container .sidebar .button.primary { }
```

### 6. Co-locate Styles with Components

```
MyComponent/
  ├── index.ts
  ├── my-component.tsx
  ├── my-component.module.css    ← Keep styles close
  ├── my-component.test.tsx
  └── my-component.stories.tsx
```

### 7. Use Utilities for Common Patterns

```tsx
/* ✅ Good - Use utilities */
<div className={clsx(utils.flex, utils.itemsCenter, utils.gap)}>

/* ❌ Bad - Recreate in every component */
<div className={styles.flexCenterGap}>
```

### 8. Avoid Inline Styles

```tsx
/* ✅ Good - CSS modules */
<div className={styles.container}>

/* ❌ Bad - Inline styles (unless truly dynamic) */
<div style={{ padding: '16px', color: '#333' }}>
```

### 9. Use CSS Variables for Dynamic Values

```tsx
/* ✅ Good - CSS variable for runtime value */
<div
  style={{ '--progress': `${percent}%` } as React.CSSProperties}
  className={styles.progressBar}
/>
```

```css
.progressBar::after {
  width: var(--progress);
}
```

### 10. Document Custom Properties

```css
/* ✅ Good - Documented tokens */
:root {
  /* Primary brand color used for buttons, links */
  --color-primary: hsl(210, 60%, 75%);

  /* Background color for main application surface */
  --color-background: hsl(45, 55%, 96%);
}
```

---

## Migration from Other Systems

### From Tailwind CSS

| Tailwind | This System |
|----------|-------------|
| `className="flex items-center"` | `className={clsx(utils.flex, utils.itemsCenter)}` |
| `className="p-4"` | `className={utils.pmd}` |
| `className="text-sm font-bold"` | `className={clsx(utils.textSm, utils.fontBold)}` |
| `className="bg-blue-500"` | `className={styles.customClass}` with `background: var(--color-primary)` |

### From Styled Components

```tsx
// Before (styled-components)
const Button = styled.button`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
`;

// After (CSS Modules)
// button.module.css
.button {
  padding: var(--spacing-md);
  background: var(--color-primary);
}

// button.tsx
<button className={styles.button}>
```

### From Emotion/CSS-in-JS

```tsx
// Before (Emotion)
<div
  css={{
    display: 'flex',
    padding: theme.spacing[4],
    color: theme.colors.primary,
  }}
/>

// After (CSS Modules)
// component.module.css
.container {
  display: flex;
  padding: var(--spacing-md);
  color: var(--color-primary);
}

// component.tsx
<div className={styles.container} />
```

---

## Summary

**Key Takeaways:**

1. **CSS Modules** provide scoped, type-safe component styles
2. **Design tokens** in `globals.css` ensure consistency
3. **Utility classes** speed up development for common patterns
4. **TypeScript integration** catches errors at compile time
5. **Dark mode** works automatically via design tokens
6. **No runtime overhead** - all CSS is static

**Quick Reference:**

- Component styles → `component.module.css`
- Design tokens → `src/styles/globals.css`
- Utilities → `src/styles/utilities.module.css`
- TypeScript config → `tsconfig.json` (CSS Modules plugin)
- PostCSS config → `postcss.config.mjs`

**Next Steps:**

- Review existing components for patterns
- Customize design tokens in `globals.css`
- Add new utility classes as needed
- See [COMPONENTS.md](./COMPONENTS.md) for component examples
- See [WEB.md](../docs/WEB.md) for full development guide
