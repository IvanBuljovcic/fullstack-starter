# Nx Full-Stack Template

A production-ready monorepo template for building modern full-stack TypeScript applications with NestJS backend, Next.js frontend, Prisma ORM, and PostgreSQL database.

## Features

- **Nx Monorepo**: Advanced build system with computation caching and dependency graph
- **NestJS Backend**: Scalable Node.js framework with TypeScript and dependency injection
- **Next.js Frontend**: React 19 with Next.js 16 for modern web applications
- **Prisma ORM**: Type-safe database access with migrations and introspection
- **PostgreSQL**: Reliable relational database with Docker Compose setup
- **Shared Libraries**: Type-safe communication between frontend and backend
- **E2E Testing**: Playwright for both API and web application testing
- **Code Quality**: Biome for fast linting and formatting
- **Git Hooks**: Husky with Commitizen for conventional commits
- **Type Safety**: Full TypeScript coverage across the monorepo

## Perfect For

- SaaS applications
- Internal tools and dashboards
- E-commerce platforms
- Inventory management systems
- CRM/ERP systems
- Booking and scheduling applications
- Any full-stack TypeScript project requiring scalability

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Nx 22.5 |
| **Backend** | NestJS 11 |
| **Frontend** | Next.js 16 + React 19 |
| **Database** | PostgreSQL 16 + Prisma 5 |
| **Package Manager** | pnpm |
| **Language** | TypeScript 5.9 |
| **Testing** | Playwright, Jest |
| **Code Quality** | Biome, Husky, Commitlint |

## Project Structure

```
inventory-system/
├── api/                    # NestJS backend API
│   ├── src/
│   │   ├── app/           # Main application module
│   │   ├── prisma/        # Prisma service & module
│   │   └── generated/     # Generated Prisma Client
│   ├── prisma/
│   │   └── schema.prisma  # Database schema definition
│   └── .env.example       # Environment variables template
├── web/                    # Next.js frontend
│   ├── src/
│   │   └── app/          # Next.js app directory
│   └── public/           # Static assets
├── libs/                   # Shared libraries
│   └── shared/
│       └── types/         # Shared TypeScript types/interfaces
├── api-e2e/               # API end-to-end tests
├── web-e2e/               # Web end-to-end tests
├── packages/              # Additional packages
├── docker-compose.yml     # PostgreSQL database configuration
├── nx.json               # Nx workspace configuration
├── tsconfig.base.json    # Base TypeScript configuration
└── biome.json            # Biome linter/formatter config
```

## Quick Start

### Prerequisites

- **Node.js** 18 or higher (24.14.0 recommended)
- **pnpm** (`npm install -g pnpm`)
- **Docker** and Docker Compose

### 1. Use This Template

Click the "Use this template" button on GitHub, or clone this repository:

```bash
git clone https://github.com/YOUR_USERNAME/inventory-system.git my-project
cd my-project
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Database

```bash
docker compose up -d
```

This starts a PostgreSQL container with:
- **Database**: `inventory-system_dev`
- **User**: `inventory-system_user`
- **Password**: `inventory-system_dev_password`
- **Port**: `5432`

Verify the database is running:
```bash
docker compose ps
```

### 4. Configure Environment Variables

```bash
cd api
cp .env.example .env
```

The `.env` file is pre-configured to work with the Docker database. Modify as needed for your project.

### 5. Define Your Database Schema

Edit `api/prisma/schema.prisma` and add your data models. For example:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 6. Create and Run Database Migrations

```bash
cd api
pnpm prisma migrate dev --name init
```

This will:
1. Create migration files in `api/prisma/migrations/`
2. Apply migrations to the PostgreSQL database
3. Generate the Prisma Client in `api/src/generated/prisma/`

### 7. Setup Test Database (Optional but Recommended)

For running integration tests, create a separate test database:

```bash
# Create test database
docker exec inventory-system-postgres psql -U inventory-system_user -d postgres -c "CREATE DATABASE \"inventory-system_test\";"

# Apply migrations to test database
cd api
node -e "process.env.DATABASE_URL='postgresql://inventory-system_user:inventory-system_password@localhost:5433/inventory-system_test?schema=public'; require('child_process').execSync('pnpm exec prisma migrate deploy', {stdio: 'inherit', env: {...process.env, DATABASE_URL: 'postgresql://inventory-system_user:inventory-system_password@localhost:5433/inventory-system_test?schema=public'}})"
```

The `.env.test` file is already configured and integration tests will automatically use the test database.

### 8. Seed Development Database (Optional)

Populate your development database with sample data:

```bash
cd api
pnpm prisma db seed
```

This creates sample users, lists, and items for testing and development.

### 9. Run the Applications

**Terminal 1 - Start the API:**
```bash
pnpm nx serve api
```
API available at `http://localhost:3000`

**Terminal 2 - Start the Web App:**
```bash
pnpm nx serve web
```
Web app available at `http://localhost:4200`

## Development Workflow

### Database Management

```bash
# Open Prisma Studio (visual database browser)
cd api && pnpm prisma studio

# Seed database with sample data (development only)
cd api && pnpm prisma db seed

# Create a new migration after schema changes
cd api && pnpm prisma migrate dev --name <migration-name>

# Regenerate Prisma Client after schema changes
cd api && pnpm prisma generate

# Push schema changes without creating migration (dev only)
cd api && pnpm prisma db push

# Reset database (WARNING: deletes all data)
cd api && pnpm prisma migrate reset
```

### Building Applications

```bash
# Build specific project
pnpm nx build api
pnpm nx build web

# Build all projects
pnpm nx run-many -t build

# Build only affected projects (based on git changes)
pnpm nx affected -t build
```

### Running Tests

```bash
# Unit tests
pnpm nx test api
pnpm nx test web

# Integration tests (uses test database)
pnpm nx test api --configuration=integration

# E2E tests
pnpm nx e2e api-e2e
pnpm nx e2e web-e2e

# Test all projects
pnpm nx run-many -t test

# Test only affected projects
pnpm nx affected -t test
```

### Code Quality

```bash
# Lint specific project
pnpm nx lint api
pnpm nx lint web

# Lint all projects
pnpm nx run-many -t lint

# Format code with Biome
pnpm format:write

# Check formatting
pnpm check

# Check only staged files (runs automatically via Husky)
pnpm check:staged
```

### Useful Nx Commands

```bash
# View project dependency graph (interactive)
pnpm nx graph

# See available tasks for a project
pnpm nx show project api

# Run multiple targets in parallel
pnpm nx run-many -t build,test,lint

# Clear Nx cache
pnpm nx reset

# See what's affected by your changes
pnpm nx affected:graph
```

## Customization Guide

### Adding a New Prisma Model

1. Edit `api/prisma/schema.prisma`
2. Run `cd api && pnpm prisma migrate dev --name add_model_name`
3. Create a NestJS module: `pnpm nx g @nx/nest:module modules/model-name --project=api`
4. Create a service: `pnpm nx g @nx/nest:service modules/model-name --project=api`
5. Create a controller: `pnpm nx g @nx/nest:controller modules/model-name --project=api`

### Adding a New Shared Library

```bash
# Create a new library
pnpm nx g @nx/js:lib my-lib --directory=libs/shared

# Use the library in your projects
import { something } from '@org/shared-my-lib';
```

### Adding Authentication

The template includes JWT configuration in `.env.example`. To implement:

1. Install dependencies: `cd api && pnpm add @nestjs/passport @nestjs/jwt passport passport-jwt`
2. Create auth module: `pnpm nx g @nx/nest:module auth --project=api`
3. Implement JWT strategy and guards
4. Use Prisma to manage user sessions

### Environment Variables

Add new environment variables to:
- `api/.env.example` (template)
- `api/.env` (local development - not committed)
- Your deployment platform (production)

## Deployment

### Building for Production

```bash
# Build all projects for production
pnpm nx run-many -t build

# Output locations:
# - API: dist/api
# - Web: dist/web/.next
```

### Docker Deployment (Optional)

Create `Dockerfile` for each application:

```dockerfile
# Example API Dockerfile
FROM node:24-alpine
WORKDIR /app
COPY dist/api ./
COPY api/prisma ./prisma
RUN npm install --production
RUN npx prisma generate
CMD ["node", "main.js"]
```

### Environment-Specific Configuration

- **Development**: Uses `docker-compose.yml` and `.env`
- **Staging/Production**: Use managed PostgreSQL (AWS RDS, Railway, Supabase)
- Update `DATABASE_URL` in your deployment platform

## Database Management in Production

```bash
# Apply migrations to production database
DATABASE_URL="postgresql://user:pass@prod-host:5432/dbname" pnpm prisma migrate deploy

# Generate Prisma Client for production
pnpm prisma generate
```

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL container is running
docker compose ps

# View database logs
docker compose logs -f postgres

# Restart the database
docker compose restart postgres
```

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
cd api && pnpm prisma generate
```

### Port Already in Use

- API (3000): Change `PORT` in `api/.env`
- Web (4200): Change port in `pnpm nx serve web --port=<new-port>`
- PostgreSQL (5432): Change in `docker-compose.yml` and `DATABASE_URL`

### Nx Cache Issues

```bash
# Clear Nx cache
pnpm nx reset

# Clear node_modules and reinstall
rm -rf node_modules api/node_modules web/node_modules
pnpm install
```

## Contributing

This is a template repository. Feel free to customize it for your needs or contribute improvements back to the template.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Use the built-in commit helper
pnpm commit

# Or manually follow the pattern:
# feat: add new feature
# fix: bug fix
# docs: documentation changes
# chore: maintenance tasks
```

## Project Documentation

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

MIT License - feel free to use this template for any project.

---

Built with Nx, NestJS, Next.js, Prisma, and PostgreSQL.
