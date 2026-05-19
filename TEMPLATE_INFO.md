# Template Information

This is a GitHub template repository for creating production-ready full-stack TypeScript applications.

## What's a GitHub Template?

A GitHub template repository allows you to create new repositories with the same directory structure and files. When you click "Use this template" on GitHub, you get a fresh copy without the original git history.

## Using This Template

### Method 1: GitHub UI (Recommended)

1. Click the **"Use this template"** button at the top of this repository
2. Enter your new repository name
3. Choose public or private
4. Click "Create repository from template"
5. Clone your new repository and follow [SETUP.md](./SETUP.md)

### Method 2: GitHub CLI

```bash
gh repo create my-new-project --template YOUR_USERNAME/nx-fullstack-template
cd my-new-project
```

### Method 3: Manual Clone

```bash
git clone https://github.com/YOUR_USERNAME/nx-fullstack-template.git my-project
cd my-project
rm -rf .git
git init
```

## What You Get

### Core Technologies

- **Nx 22.5**: Monorepo build system with intelligent caching
- **NestJS 11**: Backend framework with TypeScript
- **Next.js 16**: React 19 frontend with App Router
- **Prisma 5**: Type-safe ORM with migrations
- **PostgreSQL 16**: Relational database via Docker
- **TypeScript 5.9**: Full type safety across the stack

### Developer Experience

- **pnpm**: Fast, disk-efficient package manager
- **Biome**: Lightning-fast linting and formatting
- **Husky**: Git hooks for quality checks
- **Commitizen**: Interactive commit message tool
- **Conventional Commits**: Standardized commit messages

### Example Code

The template includes working examples:

- **Prisma Models**: `User` and `Post` with relations
- **NestJS API**: Full CRUD operations for Users
- **REST Endpoints**: `/api/users` with GET, POST, PUT, DELETE
- **Prisma Service**: Global database access pattern
- **Type-Safe Client**: Generated Prisma Client

You can keep, modify, or remove these examples as needed.

### GitHub Integration

- **CI/CD Workflow**: Automated testing on push/PR
- **Issue Templates**: Bug reports and feature requests
- **PR Template**: Structured pull request format
- **Contributing Guide**: Clear contribution guidelines

## Quick Start

After creating your repository from this template:

```bash
# 1. Clone your new repository
git clone https://github.com/YOUR_USERNAME/your-project.git
cd your-project

# 2. Run the initialization script
./init-template.sh  # or init-template.ps1 on Windows

# 3. Install dependencies
pnpm install

# 4. Start the database
docker compose up -d

# 5. Run migrations
cd api && pnpm prisma migrate dev --name init

# 6. Start development servers
pnpm nx serve api   # Terminal 1
pnpm nx serve web   # Terminal 2
```

For detailed instructions, see [SETUP.md](./SETUP.md).

## What to Customize

After using this template, customize these files:

### Required Changes

1. **package.json**: Update `name` and `description`
2. **docker-compose.yml**: Change database credentials
3. **api/.env.example**: Update DATABASE_URL
4. **README.md**: Add your project-specific information
5. **LICENSE**: Add your copyright information

### Optional Changes

1. **api/prisma/schema.prisma**: Define your data models
2. **Remove example code**: See SETUP.md for instructions
3. **.github/FUNDING.yml**: Add your sponsorship links
4. **.github/ISSUE_TEMPLATE/config.yml**: Update discussion links

## Automated Setup

The template includes initialization scripts:

- **init-template.sh**: For Linux/macOS
- **init-template.ps1**: For Windows PowerShell

These scripts will:
- Prompt for project details
- Update configuration files automatically
- Create environment variables
- Prepare the project for development

## Project Structure

```
nx-fullstack-template/
├── api/              # NestJS backend with Prisma
├── web/              # Next.js frontend
├── libs/             # Shared libraries (types, utilities)
├── api-e2e/          # API end-to-end tests
├── web-e2e/          # Web end-to-end tests
├── .github/          # GitHub templates and workflows
├── docs/             # Additional documentation
└── packages/         # Additional packages
```

## Key Features

### Nx Monorepo Benefits

- **Intelligent Caching**: Only rebuild what changed
- **Dependency Graph**: Visualize project relationships
- **Affected Commands**: Test/build only affected projects
- **Task Orchestration**: Run tasks in optimal order
- **Code Generators**: Scaffold new modules quickly

### Type Safety

- Shared TypeScript types between frontend and backend
- Prisma-generated types for database models
- Full IntelliSense support across the monorepo

### Development Workflow

- Hot reload for both API and web
- Automatic database migrations
- Pre-commit hooks for code quality
- Conventional commits enforced

### Testing Strategy

- Unit tests with Jest
- E2E tests with Playwright
- Database integration tests
- CI/CD pipeline included

## Common Use Cases

This template is ideal for:

1. **SaaS Applications**: Multi-tenant systems with user management
2. **Internal Tools**: Admin dashboards and management systems
3. **E-commerce**: Product catalogs and order management
4. **CRM/ERP**: Customer and resource management
5. **Booking Systems**: Scheduling and reservation platforms
6. **Inventory Systems**: Stock tracking and warehouse management

## Maintenance

### Keeping Your Project Updated

While this is a template (not a framework), you can manually update dependencies:

```bash
# Update all dependencies
pnpm update --latest

# Update specific packages
pnpm update @nestjs/core @nestjs/common next react
```

### Template Updates

To incorporate template improvements into your project:

1. Check the template repository for updates
2. Manually apply relevant changes to your project
3. Or maintain a remote reference to the template:
   ```bash
   git remote add template https://github.com/YOUR_USERNAME/nx-fullstack-template.git
   git fetch template
   git cherry-pick <commit-hash>
   ```

## Support

- **Documentation**: See [README.md](./README.md) and [SETUP.md](./SETUP.md)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issues**: Report bugs or request features on GitHub
- **Discussions**: Ask questions in GitHub Discussions

## License

This template is MIT licensed. Projects created from this template can use any license.

---

## Checklist for Template Maintainers

When updating this template:

- [ ] Test the initialization scripts (both .sh and .ps1)
- [ ] Verify CI/CD workflow runs successfully
- [ ] Ensure example code compiles and runs
- [ ] Update dependencies to latest stable versions
- [ ] Test database migrations work correctly
- [ ] Verify all npm scripts work
- [ ] Update documentation for any breaking changes
- [ ] Test template creation process end-to-end

---

**Ready to build something amazing? Click "Use this template" to get started!** 🚀
