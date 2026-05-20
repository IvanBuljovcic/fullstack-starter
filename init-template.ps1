# Full-Stack Starter Template Initialization Script (PowerShell)
# This script helps you customize the template for your project

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Full-Stack Starter Template Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Get project name
$PROJECT_NAME = Read-Host "Enter your project name (e.g., my-awesome-app)"
if ([string]::IsNullOrWhiteSpace($PROJECT_NAME)) {
    Write-Host "Error: Project name cannot be empty. Exiting." -ForegroundColor Red
    exit 1
}

# Validate project name (alphanumeric, hyphens, underscores only)
if ($PROJECT_NAME -notmatch '^[a-zA-Z0-9_-]+$') {
    Write-Host "Error: Project name can only contain letters, numbers, hyphens, and underscores." -ForegroundColor Red
    exit 1
}

# Get organization/scope name
$ORG_NAME = Read-Host "Enter organization name for packages (default: starter)"
if ([string]::IsNullOrWhiteSpace($ORG_NAME)) {
    $ORG_NAME = "starter"
}

# Get database configuration
$DB_NAME_DEFAULT = "${PROJECT_NAME}_dev"
$DB_NAME = Read-Host "Enter database name (default: $DB_NAME_DEFAULT)"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) {
    $DB_NAME = $DB_NAME_DEFAULT
}

$DB_USER_DEFAULT = "${PROJECT_NAME}_user"
$DB_USER = Read-Host "Enter database user (default: $DB_USER_DEFAULT)"
if ([string]::IsNullOrWhiteSpace($DB_USER)) {
    $DB_USER = $DB_USER_DEFAULT
}

$DB_PASSWORD_DEFAULT = "${PROJECT_NAME}_password"
$DB_PASSWORD = Read-Host "Enter database password (default: $DB_PASSWORD_DEFAULT)"
if ([string]::IsNullOrWhiteSpace($DB_PASSWORD)) {
    $DB_PASSWORD = $DB_PASSWORD_DEFAULT
}

# Get port configuration
$API_PORT = Read-Host "Enter API port (default: 3000)"
if ([string]::IsNullOrWhiteSpace($API_PORT)) {
    $API_PORT = "3000"
}

$WEB_PORT = Read-Host "Enter Web port (default: 4200)"
if ([string]::IsNullOrWhiteSpace($WEB_PORT)) {
    $WEB_PORT = "4200"
}

$DB_PORT = Read-Host "Enter database port (default: 5433)"
if ([string]::IsNullOrWhiteSpace($DB_PORT)) {
    $DB_PORT = "5433"
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Configuration Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Project Name:     $PROJECT_NAME" -ForegroundColor Yellow
Write-Host "Organization:     @$ORG_NAME" -ForegroundColor Yellow
Write-Host "Database Name:    $DB_NAME" -ForegroundColor Yellow
Write-Host "Database User:    $DB_USER" -ForegroundColor Yellow
Write-Host "Database Password: $DB_PASSWORD" -ForegroundColor Yellow
Write-Host "API Port:         $API_PORT" -ForegroundColor Yellow
Write-Host "Web Port:         $WEB_PORT" -ForegroundColor Yellow
Write-Host "Database Port:    $DB_PORT" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$CONFIRM = Read-Host "Is this correct? (Y/n)"
if ([string]::IsNullOrWhiteSpace($CONFIRM)) {
    $CONFIRM = "y"
}
if ($CONFIRM -ne "y" -and $CONFIRM -ne "Y") {
    Write-Host "Setup cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Updating configuration files..." -ForegroundColor Green
Write-Host ""

# Update package.json
if (Test-Path "package.json") {
    $content = Get-Content "package.json" -Raw
    $content = $content -replace '"name": "fullstack-starter"', "`"name`": `"$PROJECT_NAME`""
    $content | Set-Content "package.json" -NoNewline
    Write-Host "  [OK] Updated package.json" -ForegroundColor Green
}

# Update api/package.json
if (Test-Path "api\package.json") {
    $content = Get-Content "api\package.json" -Raw
    $content = $content -replace '@starter', "@$ORG_NAME"
    $content | Set-Content "api\package.json" -NoNewline
    Write-Host "  [OK] Updated api/package.json" -ForegroundColor Green
}

# Update web/package.json
if (Test-Path "web\package.json") {
    $content = Get-Content "web\package.json" -Raw
    $content = $content -replace '@starter', "@$ORG_NAME"
    # Update dev script to use the chosen port
    $content = $content -replace '"dev": "next dev --turbopack"', "`"dev`": `"next dev --turbopack --port $WEB_PORT`""
    $content = $content -replace '"dev": "next dev"', "`"dev`": `"next dev --port $WEB_PORT`""
    $content | Set-Content "web\package.json" -NoNewline
    Write-Host "  [OK] Updated web/package.json" -ForegroundColor Green
}

# Update libs/shared/types/package.json
if (Test-Path "libs\shared\types\package.json") {
    $content = Get-Content "libs\shared\types\package.json" -Raw
    $content = $content -replace '@starter', "@$ORG_NAME"
    $content | Set-Content "libs\shared\types\package.json" -NoNewline
    Write-Host "  [OK] Updated libs/shared/types/package.json" -ForegroundColor Green
}

# Update tsconfig.base.json
if (Test-Path "tsconfig.base.json") {
    $content = Get-Content "tsconfig.base.json" -Raw
    $content = $content -replace '@starter', "@$ORG_NAME"
    $content | Set-Content "tsconfig.base.json" -NoNewline
    Write-Host "  [OK] Updated tsconfig.base.json" -ForegroundColor Green
}

# Update docker-compose.yml
if (Test-Path "docker-compose.yml") {
    $content = Get-Content "docker-compose.yml" -Raw
    $content = $content -replace 'container_name: starter-postgres', "container_name: ${PROJECT_NAME}-postgres"
    $content = $content -replace 'POSTGRES_DB: starter_dev', "POSTGRES_DB: $DB_NAME"
    $content = $content -replace 'POSTGRES_USER: starter_user', "POSTGRES_USER: $DB_USER"
    $content = $content -replace 'POSTGRES_PASSWORD: starter_password', "POSTGRES_PASSWORD: $DB_PASSWORD"
    $content = $content -replace "'\d+:5432'", "'${DB_PORT}:5432'"
    $content = $content -replace 'pg_isready -U starter_user -d starter_dev', "pg_isready -U $DB_USER -d $DB_NAME"
    $content | Set-Content "docker-compose.yml" -NoNewline
    Write-Host "  [OK] Updated docker-compose.yml" -ForegroundColor Green
}

# Update api/.env.example
if (Test-Path "api\.env.example") {
    $DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"
    $content = Get-Content "api\.env.example" -Raw
    $content = $content -replace 'DATABASE_URL=.*', "DATABASE_URL=$DATABASE_URL"
    $content = $content -replace 'PORT=\d+', "PORT=$API_PORT"
    $content = $content -replace 'CORS_ORIGIN=.*', "CORS_ORIGIN=http://localhost:$WEB_PORT"
    $content | Set-Content "api\.env.example" -NoNewline
    Write-Host "  [OK] Updated api/.env.example" -ForegroundColor Green
}

# Update api/.env.test
if (Test-Path "api\.env.test") {
    $TEST_DB_NAME = $DB_NAME -replace '_dev$', '_test'
    $TEST_DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${TEST_DB_NAME}?schema=public"
    $content = Get-Content "api\.env.test" -Raw
    $content = $content -replace 'DATABASE_URL=.*', "DATABASE_URL=$TEST_DATABASE_URL"
    $content = $content -replace 'CORS_ORIGIN=.*', "CORS_ORIGIN=http://localhost:$WEB_PORT"
    $content | Set-Content "api\.env.test" -NoNewline
    Write-Host "  [OK] Updated api/.env.test" -ForegroundColor Green
}

# Create api/.env from api/.env.example
if ((Test-Path "api\.env.example") -and (-not (Test-Path "api\.env"))) {
    Copy-Item "api\.env.example" "api\.env"
    Write-Host "  [OK] Created api/.env" -ForegroundColor Green
} elseif (Test-Path "api\.env") {
    Write-Host "  [SKIP] api/.env already exists" -ForegroundColor Yellow
}

# Update README.md
if (Test-Path "README.md") {
    $content = Get-Content "README.md" -Raw
    $content = $content -replace 'fullstack-starter', $PROJECT_NAME
    $content = $content -replace 'starter_dev', $DB_NAME
    $content = $content -replace 'starter_user', $DB_USER
    $content = $content -replace 'starter_password', $DB_PASSWORD
    $content = $content -replace ':3000', ":$API_PORT"
    $content = $content -replace ':4200', ":$WEB_PORT"
    $content = $content -replace ':5433', ":$DB_PORT"
    $content | Set-Content "README.md" -NoNewline
    Write-Host "  [OK] Updated README.md" -ForegroundColor Green
}

# Handle git remote
if (Test-Path ".git" -PathType Container) {
    Write-Host ""
    Write-Host "Git repository detected." -ForegroundColor Yellow
    $REMOVE_REMOTE = Read-Host "Do you want to remove the template's git remote? (Y/n)"
    if ([string]::IsNullOrWhiteSpace($REMOVE_REMOTE)) {
        $REMOVE_REMOTE = "y"
    }

    if ($REMOVE_REMOTE -eq "y" -or $REMOVE_REMOTE -eq "Y") {
        try {
            git remote remove origin 2>$null
            Write-Host "  [OK] Removed template's git remote" -ForegroundColor Green
            Write-Host ""
            Write-Host "  To add your own repository:" -ForegroundColor Yellow
            Write-Host "  git remote add origin <your-repository-url>" -ForegroundColor White
        } catch {
            # Silently ignore if remote doesn't exist
        }
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. pnpm install" -ForegroundColor White
Write-Host "     Install dependencies" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. docker compose up -d" -ForegroundColor White
Write-Host "     Start PostgreSQL container" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. cd api; npx prisma migrate dev --name init" -ForegroundColor White
Write-Host "     Initialize database schema" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. pnpm nx serve api" -ForegroundColor White
Write-Host "     Start backend API (http://localhost:$API_PORT)" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. pnpm nx dev web" -ForegroundColor White
Write-Host "     Start frontend (http://localhost:$WEB_PORT)" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  - SETUP.md - Detailed setup instructions" -ForegroundColor Gray
Write-Host "  - CUSTOMIZATION.md - Guide to customizing the template" -ForegroundColor Gray
Write-Host "  - TEMPLATE_GUIDE.md - Architecture and best practices" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding!" -ForegroundColor Green
Write-Host ""
