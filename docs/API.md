# API Documentation

## Overview

The API is built with **NestJS 11**, a progressive Node.js framework that uses TypeScript and follows enterprise-grade architectural patterns. It provides a clean, modular structure ready for building scalable backend services.

**Tech Stack:**

- **NestJS 11** - Backend framework
- **Prisma 7.4** - Type-safe ORM
- **PostgreSQL 16** - Database (via Docker)
- **TypeScript 5.9** - Strict mode
- **Class Validator** - DTO validation
- **Webpack** - Build system

**Port:** 3000 (configurable)

---

## Project Structure

```
api/
├── src/
│   ├── app/                    # Root module
│   │   ├── app.module.ts       # Main application module
│   │   ├── app.controller.ts   # Health check endpoint
│   │   └── app.service.ts      # Application service
│   ├── prisma/                 # Database module
│   │   ├── prisma.module.ts    # Prisma module export
│   │   └── prisma.service.ts   # Prisma client service
│   ├── assets/                 # Static assets
│   └── main.ts                 # Application entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── (migrations/)           # Database migrations (created on first migrate)
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── webpack.config.js           # Build configuration
```

---

## Getting Started

### 1. Environment Configuration

Copy the example environment file:

```bash
cp api/.env.example api/.env
```

**Required variables:**

```bash
# Database Configuration
DATABASE_URL=postgresql://starter_user:starter_password@localhost:5433/starter_dev?schema=public

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:4200
```

> **Note:** Database credentials are configured in `docker-compose.yml`. Update both files if you change them.

### 2. Start Database

The PostgreSQL database runs in Docker:

```bash
# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker ps | grep postgres
```

**Database details:**

- Host: `localhost`
- Port: `5433` (mapped from container's 5432)
- Database: `starter_dev`
- User: `starter_user`
- Password: `starter_password`

### 3. Initialize Database Schema

Create your first database migration:

```bash
cd api
npx prisma migrate dev --name init
```

This will:

1. Create the `prisma/migrations/` directory
2. Generate a migration file
3. Apply the migration to your database
4. Generate the Prisma Client

### 4. Run Development Server

From the **monorepo root**:

```bash
pnpm nx serve api
```

Or from the **api directory**:

```bash
cd api
pnpm serve
```

The API will be available at **http://localhost:3000**

**Test it:**

```bash
curl http://localhost:3000/api
# Response: {"message": "Hello API"}
```

---

## Database & Prisma

### Prisma Schema

The schema is located at `api/prisma/schema.prisma` and currently contains a minimal setup:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Add your models below this line
```

**Generated Prisma Client** is output to `src/generated/prisma` (gitignored).

### Adding Models

1. **Define your model** in `schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. **Create migration:**

```bash
cd api
npx prisma migrate dev --name add_user_model
```

3. **Prisma Client** is automatically regenerated with type-safe queries.

### Useful Prisma Commands

```bash
# Create new migration
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Generate Prisma Client (usually automatic)
npx prisma generate

# Format schema file
npx prisma format
```

### Prisma Service

The `PrismaService` is already set up and available globally:

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**Usage in your modules:**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async create(data: { email: string; name: string }) {
    return this.prisma.user.create({ data });
  }
}
```

---

## Creating New Modules

NestJS uses a modular architecture. Here's how to create a new feature module:

### 1. Generate Module Files

```bash
# From monorepo root
pnpm nx g @nx/nest:resource users --project=api

# Or using NestJS CLI directly
cd api
npx nest g resource users
```

This generates:

```
api/src/users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
└── entities/
    └── user.entity.ts
```

### 2. Import Module

Add to `app.module.ts`:

```typescript
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule, // Add your module
  ],
  // ...
})
export class AppModule {}
```

### 3. Create DTOs with Validation

Use `class-validator` for automatic validation:

```typescript
// dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}
```

DTOs are automatically validated by the global `ValidationPipe` in `main.ts`.

### 4. Implement Service

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
```

### 5. Create Controller

```typescript
// users.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

---

## API Configuration

### Global Prefix

All routes are prefixed with `/api` (configured in `main.ts`):

```typescript
app.setGlobalPrefix('api');
```

Example: `@Controller('users')` → `http://localhost:3000/api/users`

### Global Validation Pipe

Automatic DTO validation is enabled globally:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip unknown properties
    transform: true, // Auto-transform to DTO types
    forbidNonWhitelisted: true,
  })
);
```

### CORS

CORS is configured from environment variables:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
});
```

---

## Testing

### Unit Tests

Unit tests use Jest and are co-located with source files:

```bash
# Run all API tests
pnpm nx test api

# Run tests in watch mode
pnpm nx test api --watch

# Run specific test file
pnpm nx test api --testFile=users.service.spec.ts
```

**Example test:**

```typescript
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Integration Tests

Integration tests are in the `api-e2e` project:

```bash
# Run E2E tests
pnpm nx e2e api-e2e

# With specific configuration
pnpm nx e2e api-e2e --configuration=ci
```

**Test setup:**

- `api-e2e/src/support/global-setup.ts` - Initialize test database
- `api-e2e/src/support/test-setup.ts` - Per-test configuration
- `api-e2e/src/support/global-teardown.ts` - Cleanup

---

## Building for Production

### Build

```bash
# From monorepo root
pnpm nx build api

# Output: api/dist/
```

### Pruning Dependencies

For optimized Docker images, use the prune target:

```bash
pnpm nx run api:prune
```

This creates:

- `api/dist/package.json` - Production dependencies only
- `api/dist/pnpm-lock.yaml` - Pruned lockfile
- `api/dist/workspace_modules/` - Local workspace packages

### Running Production Build

```bash
cd api/dist
pnpm install --prod
node main.js
```

---

## NestJS Key Concepts

### Modules

Modules organize related functionality:

```typescript
@Module({
  imports: [OtherModule], // Import other modules
  controllers: [UsersController], // HTTP route handlers
  providers: [UsersService], // Services, repositories, etc.
  exports: [UsersService], // Make available to other modules
})
export class UsersModule {}
```

### Controllers

Handle HTTP requests:

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    /* ... */
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    /* ... */
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    /* ... */
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    /* ... */
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    /* ... */
  }
}
```

### Providers (Services)

Business logic and data access:

```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

### Dependency Injection

NestJS uses constructor-based injection:

```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}
}
```

---

## Environment Variables

Managed by `@nestjs/config` (already configured globally in `app.module.ts`):

```typescript
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
  constructor(private config: ConfigService) {}

  getApiKey() {
    return this.config.get<string>('API_KEY');
  }
}
```

**Type-safe configuration** (optional):

```typescript
// src/config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
});
```

---

## Common Patterns

### Error Handling

NestJS provides built-in HTTP exceptions:

```typescript
import { NotFoundException, BadRequestException } from "@nestjs/common";

async findOne(id: string) {
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  return user;
}
```

### Pipes (Validation & Transformation)

Already enabled globally. Custom pipes:

```typescript
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException("Validation failed");
    }
    return val;
  }
}

// Usage
@Get(":id")
findOne(@Param("id", ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

### Guards (Authorization)

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

// Usage
@UseGuards(AuthGuard)
@Get("protected")
protected() {
  return "Protected route";
}
```

### Interceptors (Transform Responses)

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => ({ success: true, data })));
  }
}
```

---

## Recommended Additions

The starter template is intentionally minimal. Common additions for production apps:

### Authentication

```bash
pnpm add @nestjs/passport @nestjs/jwt passport passport-jwt bcryptjs
pnpm add -D @types/passport-jwt @types/bcryptjs
```

**Resources:**

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Strategy](https://docs.nestjs.com/recipes/passport#jwt-strategy)

### Validation

Already included: `class-validator`, `class-transformer`

**Additional decorators:**

- `@IsOptional()`, `@IsEnum()`, `@IsDate()`, `@IsArray()`
- [class-validator docs](https://github.com/typestack/class-validator#validation-decorators)

### API Documentation

```bash
pnpm add @nestjs/swagger
```

Add Swagger UI to document your API automatically.

### Caching

```bash
pnpm add @nestjs/cache-manager cache-manager
```

### Rate Limiting

```bash
pnpm add @nestjs/throttler
```

### Logging

```bash
pnpm add pino pino-http pino-pretty
```

### Task Scheduling

```bash
pnpm add @nestjs/schedule
```

---

## Docker & Deployment

### Dockerfile Example

```dockerfile
# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm nx build api
RUN pnpm nx run api:prune

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/api/dist ./
RUN corepack enable && pnpm install --prod
EXPOSE 3000
CMD ["node", "main.js"]
```

### Environment Variables in Production

Use a `.env.production` file or set variables directly:

```bash
DATABASE_URL=postgresql://user:pass@db-host:5432/prod_db
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check Docker container is running
docker ps | grep postgres

# Check logs
docker logs starter-postgres

# Test connection
docker exec -it starter-postgres psql -U starter_user -d starter_dev
```

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
cd api
npx prisma generate
```

### Port Already in Use

Change port in `api/.env`:

```bash
PORT=3001
```

### Module Not Found Errors

Rebuild the project:

```bash
pnpm nx build api
# or
pnpm nx reset
pnpm nx build api
```

---

## Additional Resources

- **NestJS Documentation:** https://docs.nestjs.com
- **Prisma Documentation:** https://www.prisma.io/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs

---

## Related Documentation

- [Web Documentation](./WEB.md) - Frontend (Next.js) documentation
- [Setup Guide](../SETUP.md) - Initial project setup
- [Customization Guide](../CUSTOMIZATION.md) - How to customize the template
- [Architecture Guide](../TEMPLATE_GUIDE.md) - Overall architecture and patterns
