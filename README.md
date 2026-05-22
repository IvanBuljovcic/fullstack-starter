# Full-Stack Starter Template

A production-ready monorepo template for building modern full-stack TypeScript applications with **NestJS** backend, **Next.js 16** frontend, **Prisma** ORM, and **PostgreSQL** database.

---

## ✨ Features

### Backend (NestJS 11)

- 🏗️ **Modular Architecture** - Scalable NestJS with dependency injection
- 🗄️ **Prisma ORM** - Type-safe database access with PostgreSQL 16
- 🔒 **Validation** - Automatic DTO validation with class-validator
- 🐳 **Docker** - PostgreSQL via Docker Compose
- ✅ **Testing** - Jest for unit tests, Playwright for E2E

### Frontend (Next.js 16 + React 19)

- ⚡ **Turbopack** - Lightning-fast development builds
- 🎨 **Component Library** - 8+ production-ready UI components
- 🪝 **Custom Hooks** - 15+ utility hooks (infinite scroll, keyboard nav, etc.)
- 📊 **TanStack Query** - Powerful server state management
- 🧩 **Adapter Pattern** - Swappable API backends
- 📝 **Form Validation** - React Hook Form + Zod
- 🧪 **Testing** - Vitest + React Testing Library
- 📖 **Storybook** - Component documentation and testing
- ♿ **Accessibility** - Built-in screen reader support and keyboard navigation
- 🎭 **Error Boundaries** - Multi-level error handling with retry

### Monorepo (Nx 22.5)

- 🚀 **Intelligent Caching** - Fast incremental builds
- 📦 **Shared Libraries** - Type-safe code sharing
- 🏗️ **Microservices Ready** - Scalable apps/libs structure for services
- 🔧 **Code Quality** - Biome for linting and formatting
- 🪝 **Git Hooks** - Husky + Commitlint for conventional commits
- 📏 **Consistent** - Single source of truth for dependencies

---

## 🎯 Perfect For

- SaaS applications
- Internal tools and dashboards
- E-commerce platforms
- CRM/ERP systems
- Booking and scheduling applications
- API-first applications
- Microservices architectures
- Any full-stack TypeScript project requiring scalability

---

## 🛠️ Tech Stack

| Layer                | Technology                  | Version  |
| -------------------- | --------------------------- | -------- |
| **Monorepo**         | Nx                          | 22.5     |
| **Backend**          | NestJS                      | 11       |
| **Frontend**         | Next.js                     | 16       |
| **UI**               | React                       | 19       |
| **Database**         | PostgreSQL                  | 16       |
| **ORM**              | Prisma                      | 7.4      |
| **State Management** | TanStack Query              | 5        |
| **Forms**            | React Hook Form + Zod       | 7 + 4    |
| **Testing**          | Vitest + Playwright         | 3 + 1.36 |
| **Styling**          | CSS Modules + CSS Variables | -        |
| **Documentation**    | Storybook                   | 8.4      |
| **Package Manager**  | pnpm                        | -        |
| **Language**         | TypeScript                  | 5.9      |
| **Code Quality**     | Biome                       | 2.4      |
| **Node Version**     | Volta                       | 22.20.0  |

---

## 📁 Project Structure

```
fullstack-starter/
├── apps/                       # Deployable Applications
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── app/            # Root module
│   │   │   ├── prisma/         # Database service
│   │   │   └── generated/      # Generated Prisma Client
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema
│   │   └── .env.example        # Environment template
│   │
│   ├── web/                    # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   ├── components/     # UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── adapters/       # API adapters
│   │   │   ├── lib/            # Utilities
│   │   │   ├── providers/      # React contexts
│   │   │   └── styles/         # Global styles
│   │   ├── .storybook/         # Storybook config
│   │   └── scripts/            # CLI tools
│   │
│   ├── api-e2e/                # API E2E tests
│   └── web-e2e/                # Web E2E tests
│
├── libs/                       # Shared Libraries
│   └── shared/
│       └── types/              # Shared TypeScript types
│
├── docs/                       # Documentation
│   ├── API.md                  # Backend documentation
│   ├── WEB.md                  # Frontend documentation
│   ├── MICROSERVICES.md        # Microservices guide
│   ├── SETUP.md                # Setup guide
│   ├── CUSTOMIZATION.md        # Customization guide
│   └── TEMPLATE_GUIDE.md       # Architecture guide
│
├── docker-compose.yml          # PostgreSQL configuration
├── nx.json                     # Nx workspace config
├── tsconfig.base.json          # Base TypeScript config
├── biome.json                  # Linter/formatter config
├── init-template.ps1           # Windows setup script
└── init-template.sh            # Linux/Mac setup script
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (22.20.0 recommended via Volta)
- **pnpm** - `npm install -g pnpm`
- **Docker** and Docker Compose

### 1. Clone or Download

```bash
# Clone this repository
git clone <repository-url> my-project
cd my-project

# Or download as ZIP and extract
```

**Note:** The initialization script will prompt you to remove the template's git remote. If you want to use your own repository, you can add it after initialization:

```bash
git remote add origin <your-repository-url>
```

### 2. Run Initialization Script

**Windows (PowerShell):**

```powershell
.\init-template.ps1
```

**Linux/Mac:**

```bash
chmod +x init-template.sh
./init-template.sh
```

The script will:

- ✅ Prompt for project name
- ✅ Configure database credentials
- ✅ Set API and web ports
- ✅ Update all configuration files
- ✅ Create environment files

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Database

```bash
docker compose up -d
```

### 5. Initialize Database

```bash
cd api
npx prisma migrate dev --name init
cd ..
```

### 6. Start Development Servers

**Option A: Start Both (Parallel)**

```bash
# Terminal 1 - API
pnpm nx serve api

# Terminal 2 - Web
pnpm nx dev web
```

**Option B: Use Nx Run-Many**

```bash
pnpm nx run-many -t serve dev -p api web
```

### 7. Verify Setup

- **API**: http://localhost:3000/api
- **Web**: http://localhost:4200
- **Storybook**: `pnpm nx run web:storybook` → http://localhost:6006

---

## 📚 Documentation

Comprehensive documentation is organized by topic:

### Core Documentation

- **[Setup Guide](./SETUP.md)** - Detailed setup instructions
- **[API Documentation](./docs/API.md)** - Backend (NestJS) guide
  - Database & Prisma
  - Creating modules
  - Testing
  - Deployment
- **[Web Documentation](./docs/WEB.md)** - Frontend (Next.js) guide
  - Component library
  - Custom hooks
  - Adapter pattern
  - Styling system
  - Testing
- **[Microservices Guide](./docs/MICROSERVICES.md)** - Adding microservices
  - NestJS services
  - .NET services
  - Shared libraries
  - Best practices
- **[Customization Guide](./CUSTOMIZATION.md)** - How to customize the template
- **[Architecture Guide](./TEMPLATE_GUIDE.md)** - Overall architecture and design patterns

### Quick References

- **[Web CLAUDE.md](./web/CLAUDE.md)** - Frontend development patterns
- **[Web README](./web/README.md)** - Next.js template specifics
- **[GitHub Actions Guide](./web/GITHUB_ACTIONS.md)** - CI/CD recommendations

---

## 🧰 Common Commands

### Development

```bash
# Start API
pnpm nx serve api

# Start Web
pnpm nx dev web

# Start Storybook
pnpm nx run web:storybook

# Run both API and Web
pnpm nx run-many -t serve -p api web
```

### Building

```bash
# Build API
pnpm nx build api

# Build Web
pnpm nx build web

# Build everything
pnpm nx run-many -t build --all
```

### Testing

```bash
# Test API
pnpm nx test api

# Test Web
pnpm nx test web

# Test Web with UI
pnpm nx test web --ui

# E2E tests
pnpm nx e2e api-e2e
pnpm nx e2e web-e2e

# All tests
pnpm nx run-many -t test
```

### Code Quality

```bash
# Format all files
pnpm format:write

# Check code quality
pnpm check

# Fix issues automatically
pnpm check:write

# Check only changed files
pnpm check:changed
```

### Database

```bash
cd api

# Create migration
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### Component Generation (Web)

```bash
cd web

# Interactive mode
pnpm generate

# With arguments
pnpm generate MyComponent --client --styles --props "title: string"
```

---

## 🏗️ Adding Features

### Backend: Create a New Module

```bash
# Generate NestJS resource
pnpm nx g @nx/nest:resource users --project=api
```

This creates:

- `api/src/users/users.module.ts`
- `api/src/users/users.controller.ts`
- `api/src/users/users.service.ts`
- DTOs and entities

See **[API Documentation](./docs/API.md)** for details.

### Frontend: Create a Component

```bash
cd web
pnpm generate MyComponent --client --styles
```

This creates:

- `src/components/MyComponent/index.ts`
- `src/components/MyComponent/my-component.tsx`
- `src/components/MyComponent/my-component.module.css`

See **[Web Documentation](./docs/WEB.md)** for details.

### Add a Database Model

1. Edit `api/prisma/schema.prisma`:

   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String
     createdAt DateTime @default(now())
   }
   ```

2. Create migration:

   ```bash
   cd api
   npx prisma migrate dev --name add_user_model
   ```

3. Use in your code:
   ```typescript
   const users = await this.prisma.user.findMany();
   ```

---

## 🎨 What's Included

### UI Components (Web)

- **Input** - Text input with validation states
- **Select** - Dropdown with custom styling
- **Checkbox** - Accessible checkbox
- **Radio** - Radio buttons with groups
- **Toast** - Notification system
- **Loader** - Loading spinner
- **SmartErrorBoundary** - Error handling with retry
- **Accessibility** - Screen reader announcers

**See them in action:** `pnpm nx run web:storybook`

### Custom Hooks (Web)

- `useInfiniteData` - API-agnostic infinite scroll
- `useInfiniteScroll` - Auto-load on scroll
- `useDebounce` - Debounce values
- `useThrottle` - Throttle events
- `useKeyboardNavigation` - Keyboard interactions
- `useGridNavigation` - Grid keyboard nav
- `useLocalStorage` - Persistent state
- And 8+ more...

### Testing Infrastructure

- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **Storybook** - Visual testing
- Example tests included

---

## 🚢 Deployment

### Vercel (Web)

```bash
cd web
vercel
```

### Docker (API)

See **[API Documentation](./docs/API.md)** for Dockerfile examples.

### Environment Variables

**Production checklist:**

- Set `DATABASE_URL` to production database
- Set `NEXT_PUBLIC_API_BASE_URL` to production API
- Set `NODE_ENV=production`
- Set `CORS_ORIGIN` to production domain
- Generate secure secrets

---

## 🤝 Contributing

This is a template repository. Fork it and customize for your needs!

**If you improve the template:**

1. Create a feature branch
2. Make your changes
3. Follow conventional commits
4. Test thoroughly
5. Submit a PR

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:

- **NestJS** - https://nestjs.com
- **Next.js** - https://nextjs.org
- **Prisma** - https://prisma.io
- **Nx** - https://nx.dev
- **TanStack Query** - https://tanstack.com/query
- **Biome** - https://biomejs.dev

---

## 📞 Support

- **Issues**: Open an issue on GitHub
- **Documentation**: Check [docs/](./docs/) folder

---

## 🗺️ Roadmap

**Potential additions:**

- [ ] Authentication scaffolding (Passport.js / NextAuth)
- [ ] Additional UI components (Button, Card, Modal, etc.)
- [ ] GraphQL support
- [ ] Rate limiting
- [ ] Caching layer
- [ ] Monitoring & logging
- [ ] Docker Compose for full-stack
- [ ] CI/CD examples

**Current status:** Fully functional production-ready starter template

---

**Happy coding!** 🎉

For detailed guides, see:

- [Setup Guide](./SETUP.md)
- [API Documentation](./docs/API.md)
- [Web Documentation](./docs/WEB.md)
