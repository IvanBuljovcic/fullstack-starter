# Contributing to Nx Full-Stack Template

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to learn and build great things together.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm
- Docker and Docker Compose
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nx-fullstack-template.git
   cd nx-fullstack-template
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the database:
   ```bash
   docker compose up -d
   ```

5. Setup the database:
   ```bash
   cd api
   cp .env.example .env
   pnpm prisma migrate dev
   ```

6. Run the development servers:
   ```bash
   # Terminal 1
   pnpm nx serve api

   # Terminal 2
   pnpm nx serve web
   ```

## Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions or modifications
- `chore/description` - Maintenance tasks

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Use the built-in helper:

```bash
pnpm commit
```

Or follow this format manually:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`
- `chore: update dependencies`

### Code Quality

Before submitting a PR, ensure:

1. **Code is formatted**:
   ```bash
   pnpm format:write
   ```

2. **Linting passes**:
   ```bash
   pnpm check
   ```

3. **Tests pass**:
   ```bash
   pnpm nx run-many -t test
   ```

4. **Build succeeds**:
   ```bash
   pnpm nx run-many -t build
   ```

### Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style and conventions

3. **Test thoroughly**:
   ```bash
   pnpm nx affected -t test,lint,build
   ```

4. **Commit your changes** using conventional commits

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Fill out the PR template completely
   - Reference any related issues
   - Add screenshots for UI changes

7. **Address review feedback** promptly

8. **Wait for approval** - At least one maintainer must approve

### Code Review Guidelines

When reviewing PRs:

- Be respectful and constructive
- Focus on code quality, not personal preferences
- Explain the reasoning behind suggestions
- Approve if changes are good enough (don't nitpick)
- Request changes only for significant issues

## Project Structure

```
nx-fullstack-template/
├── api/              # NestJS backend
├── web/              # Next.js frontend
├── libs/             # Shared libraries
├── api-e2e/          # API E2E tests
├── web-e2e/          # Web E2E tests
└── packages/         # Additional packages
```

## Adding New Features

### Adding a Database Model

1. Edit `api/prisma/schema.prisma`
2. Create migration: `cd api && pnpm prisma migrate dev --name add_model`
3. Generate client: `pnpm prisma generate`

### Adding a NestJS Module

```bash
pnpm nx g @nx/nest:module modules/feature-name --project=api
pnpm nx g @nx/nest:service modules/feature-name --project=api
pnpm nx g @nx/nest:controller modules/feature-name --project=api
```

### Adding a Next.js Page

Create files in `web/src/app/` following Next.js App Router conventions.

### Adding a Shared Library

```bash
pnpm nx g @nx/js:lib lib-name --directory=libs/shared
```

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm nx run-many -t test

# Run tests for specific project
pnpm nx test api
pnpm nx test web

# Run tests in watch mode
pnpm nx test api --watch

# Run with coverage
pnpm nx test api --coverage
```

### E2E Tests

```bash
# Run all E2E tests
pnpm nx run-many -t e2e

# Run specific E2E tests
pnpm nx e2e api-e2e
pnpm nx e2e web-e2e
```

### Integration Tests

Ensure the database is running for integration tests:

```bash
docker compose up -d
pnpm nx e2e api-e2e
```

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Update CHANGELOG.md for notable changes
- Create migration guides for breaking changes

## Releasing (Maintainers Only)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a release commit: `chore: release v1.2.3`
4. Tag the release: `git tag v1.2.3`
5. Push: `git push && git push --tags`
6. Create GitHub release with changelog

## Getting Help

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Review documentation and examples

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing!
