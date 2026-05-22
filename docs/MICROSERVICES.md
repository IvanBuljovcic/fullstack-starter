# Adding Microservices to Your Nx Monorepo

This guide explains how to add microservices to your Nx workspace using the apps/libs structure.

## Table of Contents

- [Quick Start](#quick-start)
- [Adding a NestJS Microservice](#adding-a-nestjs-microservice)
- [Adding a .NET Microservice](#adding-a-net-microservice)
- [Adding Other Frameworks](#adding-other-frameworks)
- [Best Practices](#best-practices)

## Quick Start

The workspace is structured for microservices:

```
fullstack-starter/
├── apps/              # All deployable applications
│   ├── api/          # Main NestJS backend
│   ├── web/          # Main Next.js frontend
│   ├── api-e2e/      # E2E tests
│   └── web-e2e/      # E2E tests
└── libs/             # Shared libraries
    └── shared/
        └── types/    # Shared TypeScript types
```

Add new microservices to the `apps/` directory. Shared code goes in `libs/`.

## Adding a NestJS Microservice

NestJS is the recommended framework for Node.js microservices in this template.

### 1. Generate the Service

```bash
pnpm nx g @nx/nest:app my-service --directory=apps/my-service --tags=type:service,scope:my-service
```

**Options:**

- `--directory=apps/my-service` - Places service in apps folder (required)
- `--tags=type:service,scope:my-service` - Adds Nx tags for organization
- `--linter=none` - Skip ESLint (optional, we use Biome)
- `--unitTestRunner=none` - Skip test setup (optional)
- `--e2eTestRunner=none` - Skip E2E tests (optional)

### 2. Configure the Service

The generator creates:

```
apps/my-service/
├── src/
│   ├── app/
│   │   ├── app.controller.ts  # HTTP controller
│   │   ├── app.module.ts      # Root module
│   │   └── app.service.ts     # Business logic
│   ├── assets/                # Static assets
│   └── main.ts                # Bootstrap file
├── tsconfig.app.json          # TypeScript config
├── tsconfig.json              # Base TypeScript config
├── webpack.config.js          # Webpack config
└── package.json               # Service dependencies
```

### 3. Run the Service

```bash
# Development mode
pnpm nx serve my-service

# Production build
pnpm nx build my-service

# Run tests (if configured)
pnpm nx test my-service
```

### 4. Configure Port (Optional)

By default, NestJS services run on port 3000. To change this:

Edit `apps/my-service/src/main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001; // Change port here
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
```

### 5. Add Environment Variables

Create `apps/my-service/.env`:

```bash
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
# Add other environment variables
```

### 6. Share Code with Other Services

Create shared libraries in `libs/` for code reuse:

```bash
# Shared domain logic
pnpm nx g @nx/js:lib my-service-domain --directory=libs/my-service/domain

# Shared DTOs
pnpm nx g @nx/js:lib shared-dto --directory=libs/shared/dto

# Shared utilities
pnpm nx g @nx/js:lib shared-utils --directory=libs/shared/utils
```

Import in your service:

```typescript
import { MyDto } from '@starter/shared-dto';
import { MyDomainLogic } from '@starter/my-service-domain';
```

## Adding a .NET Microservice

For .NET microservices, manual setup is required as Nx doesn't have built-in .NET support.

### 1. Generate .NET Project

```bash
# Navigate to apps directory
cd apps

# Create .NET Web API
dotnet new webapi -n my-service -o my-service --no-https

# Return to root
cd ..
```

### 2. Create Nx Configuration

Create `apps/my-service/project.json`:

```json
{
  "name": "my-service",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/my-service",
  "projectType": "application",
  "tags": ["type:service", "scope:my-service"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "dotnet build",
        "cwd": "apps/my-service"
      }
    },
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "dotnet run",
        "cwd": "apps/my-service"
      }
    },
    "test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "dotnet test",
        "cwd": "apps/my-service"
      }
    }
  }
}
```

### 3. Run the Service

```bash
# Development mode
pnpm nx serve my-service

# Build
pnpm nx build my-service

# Run tests
pnpm nx test my-service
```

## Adding Other Frameworks

You can add microservices in any framework using custom Nx executors.

### Express.js Example

```bash
pnpm nx g @nx/node:app my-service --directory=apps/my-service --framework=express
```

### Python/FastAPI Example

1. Create the directory structure:

   ```bash
   mkdir -p apps/my-service/src
   ```

2. Create `apps/my-service/project.json`:

   ```json
   {
     "name": "my-service",
     "$schema": "../../node_modules/nx/schemas/project-schema.json",
     "sourceRoot": "apps/my-service/src",
     "projectType": "application",
     "tags": ["type:service", "scope:my-service"],
     "targets": {
       "serve": {
         "executor": "nx:run-commands",
         "options": {
           "command": "uvicorn main:app --reload",
           "cwd": "apps/my-service/src"
         }
       },
       "test": {
         "executor": "nx:run-commands",
         "options": {
           "command": "pytest",
           "cwd": "apps/my-service"
         }
       }
     }
   }
   ```

3. Add your Python code in `apps/my-service/src/`

## Best Practices

### 1. Service Naming Conventions

- Use kebab-case: `user-service`, `payment-service`
- Add `-service` suffix for clarity
- Keep names short and descriptive

### 2. Organizing Shared Code

```
libs/
├── shared/              # Code shared across all services
│   ├── types/          # TypeScript types/interfaces
│   ├── dto/            # Data Transfer Objects
│   ├── utils/          # Utility functions
│   └── interfaces/     # API contracts
├── user/               # User service domain
│   ├── domain/         # Business logic
│   └── data-access/    # Database/API access
└── payment/            # Payment service domain
    ├── domain/
    └── data-access/
```

### 3. Tagging Strategy

Use tags to organize and constrain dependencies:

```bash
# Type tags
--tags=type:service,type:lib,type:ui,type:feature

# Scope tags (domain)
--tags=scope:user,scope:payment,scope:shared

# Combined
--tags=type:service,scope:user
```

Enforce rules in `nx.json` or `.eslintrc.json`:

```json
{
  "depConstraints": [
    {
      "sourceTag": "type:service",
      "onlyDependOnLibsWithTags": ["type:lib", "scope:shared"]
    },
    {
      "sourceTag": "scope:user",
      "notDependOnLibsWithTags": ["scope:payment"]
    }
  ]
}
```

### 4. API Gateway Pattern

For microservices communication, consider adding an API gateway:

```bash
pnpm nx g @nx/nest:app api-gateway --directory=apps/api-gateway
```

The gateway routes requests to appropriate services:

```typescript
// apps/api-gateway/src/app/app.controller.ts
@Controller()
export class AppController {
  @Get('users')
  async getUsers() {
    // Forward to user-service
    return this.httpService.get('http://localhost:3001/users');
  }

  @Get('payments')
  async getPayments() {
    // Forward to payment-service
    return this.httpService.get('http://localhost:3002/payments');
  }
}
```

### 5. Docker Compose for Development

Create `docker-compose.yml` at root:

```yaml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/main

  user-service:
    build:
      context: .
      dockerfile: apps/user-service/Dockerfile
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/users

  payment-service:
    build:
      context: .
      dockerfile: apps/payment-service/Dockerfile
    ports:
      - '3002:3002'

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
```

Run all services:

```bash
docker-compose up
```

### 6. Testing Strategy

```bash
# Unit tests for individual service
pnpm nx test my-service

# Integration tests
pnpm nx test my-service --testPathPattern=integration

# E2E tests
pnpm nx e2e my-service-e2e

# Test affected services only
pnpm nx affected -t test

# Test all services
pnpm nx run-many -t test --all
```

### 7. CI/CD Configuration

In `.github/workflows/ci.yml`, tests and builds run only for affected projects:

```yaml
- name: Build affected
  run: pnpm nx affected -t build --base=origin/master

- name: Test affected
  run: pnpm nx affected -t test --base=origin/master
```

This ensures fast CI runs even with many microservices.

## Useful Commands

```bash
# List all services
pnpm nx show projects

# View project dependencies
pnpm nx graph

# Build all services
pnpm nx run-many -t build --all

# Build only changed services
pnpm nx affected -t build

# Run all services in parallel (development)
pnpm nx run-many -t serve --all --parallel=10

# Clear Nx cache
pnpm nx reset
```

## Next Steps

- **Set up message queues** (RabbitMQ, Kafka) for service communication
- **Add service discovery** (Consul, etcd) for dynamic service location
- **Implement distributed tracing** (Jaeger, Zipkin) for debugging
- **Configure Nx Cloud** for distributed task execution and caching

## References

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Nx Nest Plugin](https://nx.dev/nx-api/nest)
- [Microservices Patterns](https://microservices.io/patterns/)
