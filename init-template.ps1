# Nx Full-Stack Template Initialization Script (PowerShell)
# This script helps you customize the template for your project

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Nx Full-Stack Template Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Get project name
$PROJECT_NAME = Read-Host "Enter your project name (e.g., my-awesome-app)"
if ([string]::IsNullOrWhiteSpace($PROJECT_NAME)) {
    Write-Host "Project name cannot be empty. Exiting." -ForegroundColor Red
    exit 1
}

# Get database name
$DB_NAME_DEFAULT = "${PROJECT_NAME}_dev"
$DB_NAME = Read-Host "Enter database name (default: $DB_NAME_DEFAULT)"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) {
    $DB_NAME = $DB_NAME_DEFAULT
}

# Get database user
$DB_USER_DEFAULT = "${PROJECT_NAME}_user"
$DB_USER = Read-Host "Enter database user (default: $DB_USER_DEFAULT)"
if ([string]::IsNullOrWhiteSpace($DB_USER)) {
    $DB_USER = $DB_USER_DEFAULT
}

# Get database password
$DB_PASSWORD_DEFAULT = "${PROJECT_NAME}_password"
$DB_PASSWORD = Read-Host "Enter database password (default: $DB_PASSWORD_DEFAULT)"
if ([string]::IsNullOrWhiteSpace($DB_PASSWORD)) {
    $DB_PASSWORD = $DB_PASSWORD_DEFAULT
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Configuration Summary" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Project Name: $PROJECT_NAME" -ForegroundColor Yellow
Write-Host "Database Name: $DB_NAME" -ForegroundColor Yellow
Write-Host "Database User: $DB_USER" -ForegroundColor Yellow
Write-Host "Database Password: $DB_PASSWORD" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$CONFIRM = Read-Host "Is this correct? (y/n)"
if ($CONFIRM -ne "y") {
    Write-Host "Setup cancelled." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Updating configuration files..." -ForegroundColor Green

# Update package.json
if (Test-Path "package.json") {
    $content = Get-Content "package.json" -Raw
    $content = $content -replace '"name": "nx-fullstack-app"', "`"name`": `"$PROJECT_NAME`""
    $content | Set-Content "package.json" -NoNewline
    Write-Host "[OK] Updated package.json" -ForegroundColor Green
}

# Update docker-compose.yml
if (Test-Path "docker-compose.yml") {
    $content = Get-Content "docker-compose.yml" -Raw
    $content = $content -replace 'container_name: app-postgres', "container_name: ${PROJECT_NAME}-postgres"
    $content = $content -replace 'POSTGRES_DB: app_dev', "POSTGRES_DB: $DB_NAME"
    $content = $content -replace 'POSTGRES_USER: app_user', "POSTGRES_USER: $DB_USER"
    $content = $content -replace 'POSTGRES_PASSWORD: app_dev_password', "POSTGRES_PASSWORD: $DB_PASSWORD"
    $content = $content -replace 'pg_isready -U app_user -d app_dev', "pg_isready -U $DB_USER -d $DB_NAME"
    $content | Set-Content "docker-compose.yml" -NoNewline
    Write-Host "[OK] Updated docker-compose.yml" -ForegroundColor Green
}

# Update api/.env.example
if (Test-Path "api\.env.example") {
    $DATABASE_URL = "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
    $content = Get-Content "api\.env.example" -Raw
    $content = $content -replace 'DATABASE_URL=.*', "DATABASE_URL=$DATABASE_URL"
    $content | Set-Content "api\.env.example" -NoNewline
    Write-Host "[OK] Updated api\.env.example" -ForegroundColor Green
}

# Create api/.env from api/.env.example
if ((Test-Path "api\.env.example") -and (-not (Test-Path "api\.env"))) {
    Copy-Item "api\.env.example" "api\.env"
    Write-Host "[OK] Created api\.env" -ForegroundColor Green
}

# Update README.md
if (Test-Path "README.md") {
    $content = Get-Content "README.md" -Raw
    $content = $content -replace 'nx-fullstack-template', $PROJECT_NAME
    $content = $content -replace 'app_dev', $DB_NAME
    $content = $content -replace 'app_user', $DB_USER
    $content = $content -replace 'app_dev_password', $DB_PASSWORD
    $content | Set-Content "README.md" -NoNewline
    Write-Host "[OK] Updated README.md" -ForegroundColor Green
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. pnpm install                                      # Install dependencies"
Write-Host "2. docker compose up -d                              # Start PostgreSQL"
Write-Host "3. cd api && pnpm prisma migrate dev --name init     # Create database"
Write-Host "4. pnpm nx serve api                                 # Start backend (port 3000)"
Write-Host "5. pnpm nx serve web                                 # Start frontend (port 4200)"
Write-Host ""
Write-Host "Happy coding!" -ForegroundColor Green
