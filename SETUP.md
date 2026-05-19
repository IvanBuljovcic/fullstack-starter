# Template Setup Guide

This guide will help you get started with the Nx Full-Stack Template.

## Quick Start (Automated)

### Option 1: Using the Initialization Script

**Linux/macOS:**
```bash
./init-template.sh
```

**Windows (PowerShell):**
```powershell
.\init-template.ps1
```

This script will:
- Prompt you for your project name
- Update configuration files automatically
- Create environment variables
- Prepare the project for development

After running the script, proceed to step 2 below.

## Manual Setup

### 1. Clone or Use Template

**Option A: Use as GitHub Template**
1. Click "Use this template" button on GitHub
2. Create your new repository
3. Clone your new repository

**Option B: Clone Directly**
```bash
git clone https://github.com/YOUR_USERNAME/nx-fullstack-template.git my-project
cd my-project
rm -rf .git  # Remove template git history
git init     # Start fresh git repository
```

### 2. Customize Project Names

Update the following files with your project details:

**package.json:**
```json
{
  "name": "your-project-name",
  "description": "Your project description"
}
```

**docker-compose.yml:**
```yaml
container_name: your-project-postgres
POSTGRES_DB: your_db_name
POSTGRES_USER: your_db_user
POSTGRES_PASSWORD: your_db_password
```

**api/.env.example:**
```env
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name?schema=public
```

### 3. Install Dependencies

```bash
pnpm install
```

If you don't have pnpm installed:
```bash
npm install -g pnpm
```

### 4. Start PostgreSQL Database

```bash
docker compose up -d
```

Verify it's running:
```bash
docker compose ps
```

### 5. Configure Environment Variables

```bash
cd api
cp .env.example .env
```

Review and update `api/.env` with your configuration.

### 6. Setup Database Schema

Edit `api/prisma/schema.prisma` to define your data models.

Example models are included - feel free to modify or remove them:
- `User` model
- `Post` model

### 7. Create and Run Migrations

```bash
cd api
pnpm prisma migrate dev --name init
```

This will:
- Create migration files
- Apply migrations to PostgreSQL
- Generate Prisma Client

### 8. Start Development Servers

**Terminal 1 - Backend (API):**
```bash
pnpm nx serve api
```

**Terminal 2 - Frontend (Web):**
```bash
pnpm nx serve web
```

Your applications will be available at:
- API: http://localhost:3000
- Web: http://localhost:4200

### 9. Verify Setup

Test the example API endpoint:
```bash
curl http://localhost:3000/api
```

You should see: `{"message":"Hello API"}`

Test the Users endpoint (after running migrations):
```bash
curl http://localhost:3000/users
```

## Next Steps

### Remove Example Code (Optional)

If you don't need the example User/Post models:

1. **Remove example models** from `api/prisma/schema.prisma`:
   - Delete `User` model
   - Delete `Post` model

2. **Remove example API module**:
   ```bash
   rm -rf api/src/users
   ```

3. **Update app.module.ts**:
   ```typescript
   // Remove UsersModule import and from imports array
   ```

4. **Reset database**:
   ```bash
   cd api
   pnpm prisma migrate reset
   pnpm prisma migrate dev --name init
   ```

### Start Building Your Application

1. **Define your data models** in `api/prisma/schema.prisma`
2. **Create migrations**: `cd api && pnpm prisma migrate dev --name description`
3. **Generate NestJS modules**:
   ```bash
   pnpm nx g @nx/nest:module modules/your-module --project=api
   pnpm nx g @nx/nest:service modules/your-module --project=api
   pnpm nx g @nx/nest:controller modules/your-module --project=api
   ```

4. **Create frontend pages** in `web/src/app/`
5. **Add shared types** in `libs/shared/types/`

## Common Tasks

### Database Management

```bash
# View data in Prisma Studio
cd api && pnpm prisma studio

# Create new migration
cd api && pnpm prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
cd api && pnpm prisma migrate reset

# Generate Prisma Client after schema changes
cd api && pnpm prisma generate
```

### Code Quality

```bash
# Format code
pnpm format:write

# Lint code
pnpm check

# Fix linting issues
pnpm check:write
```

### Testing

```bash
# Run all tests
pnpm nx run-many -t test

# Run specific project tests
pnpm nx test api
pnpm nx test web

# Run E2E tests
pnpm nx e2e api-e2e
pnpm nx e2e web-e2e
```

### Building

```bash
# Build all projects
pnpm nx run-many -t build

# Build specific project
pnpm nx build api
pnpm nx build web
```

## Project Structure

```
your-project/
├── api/                        # NestJS Backend
│   ├── src/
│   │   ├── app/               # Main app module
│   │   ├── users/             # Example users module (optional)
│   │   ├── prisma/            # Prisma service
│   │   └── generated/         # Generated Prisma Client (gitignored)
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── .env.example           # Environment template
│   └── .env                   # Your environment (gitignored)
│
├── web/                        # Next.js Frontend
│   ├── src/
│   │   └── app/               # Next.js pages (App Router)
│   └── public/                # Static assets
│
├── libs/                       # Shared Libraries
│   └── shared/
│       └── types/             # Shared TypeScript types
│
├── api-e2e/                   # API E2E tests
├── web-e2e/                   # Web E2E tests
├── packages/                  # Additional packages
│
├── .github/                   # GitHub configuration
│   ├── workflows/             # CI/CD workflows
│   └── ISSUE_TEMPLATE/        # Issue templates
│
├── docker-compose.yml         # PostgreSQL setup
├── init-template.sh           # Setup script (Bash)
├── init-template.ps1          # Setup script (PowerShell)
├── nx.json                    # Nx configuration
├── package.json               # Dependencies
└── README.md                  # Main documentation
```

## Troubleshooting

### Database Connection Errors

```bash
# Check if PostgreSQL is running
docker compose ps

# View database logs
docker compose logs -f postgres

# Restart database
docker compose restart postgres

# Completely reset database
docker compose down -v
docker compose up -d
```

### Prisma Client Not Generated

```bash
cd api
pnpm prisma generate
```

### Port Already in Use

**API (3000):**
- Change `PORT` in `api/.env`
- Or stop the process using port 3000

**Web (4200):**
```bash
pnpm nx serve web --port=4300
```

**PostgreSQL (5432):**
- Update `docker-compose.yml` ports section
- Update `DATABASE_URL` in `api/.env`

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules api/node_modules web/node_modules
rm -rf .nx
pnpm install
```

### Build Errors

```bash
# Clear Nx cache
pnpm nx reset

# Rebuild
pnpm nx run-many -t build --all
```

## Additional Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Getting Help

- Check the [README.md](./README.md) for general information
- Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub for bugs or feature requests
- Use GitHub Discussions for questions

---

Happy coding! 🚀
