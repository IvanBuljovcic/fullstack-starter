#!/bin/bash

# Nx Full-Stack Template Initialization Script
# This script helps you customize the template for your project

echo "==================================="
echo "Nx Full-Stack Template Setup"
echo "==================================="
echo ""

# Get project name
read -p "Enter your project name (e.g., my-awesome-app): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    echo "Project name cannot be empty. Exiting."
    exit 1
fi

# Get database name
read -p "Enter database name (default: ${PROJECT_NAME}_dev): " DB_NAME
DB_NAME=${DB_NAME:-"${PROJECT_NAME}_dev"}

# Get database user
read -p "Enter database user (default: ${PROJECT_NAME}_user): " DB_USER
DB_USER=${DB_USER:-"${PROJECT_NAME}_user"}

# Get database password
read -p "Enter database password (default: ${PROJECT_NAME}_password): " DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-"${PROJECT_NAME}_password"}

echo ""
echo "==================================="
echo "Configuration Summary"
echo "==================================="
echo "Project Name: $PROJECT_NAME"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo "==================================="
echo ""

read -p "Is this correct? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "Setup cancelled."
    exit 0
fi

echo ""
echo "Updating configuration files..."

# Update package.json
if [ -f "package.json" ]; then
    sed -i "s/\"name\": \"nx-fullstack-app\"/\"name\": \"$PROJECT_NAME\"/" package.json
    echo "✓ Updated package.json"
fi

# Update docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    sed -i "s/container_name: app-postgres/container_name: ${PROJECT_NAME}-postgres/" docker-compose.yml
    sed -i "s/POSTGRES_DB: app_dev/POSTGRES_DB: $DB_NAME/" docker-compose.yml
    sed -i "s/POSTGRES_USER: app_user/POSTGRES_USER: $DB_USER/" docker-compose.yml
    sed -i "s/POSTGRES_PASSWORD: app_dev_password/POSTGRES_PASSWORD: $DB_PASSWORD/" docker-compose.yml
    sed -i "s/pg_isready -U app_user -d app_dev/pg_isready -U $DB_USER -d $DB_NAME/" docker-compose.yml
    echo "✓ Updated docker-compose.yml"
fi

# Update .env.example
if [ -f "api/.env.example" ]; then
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" api/.env.example
    echo "✓ Updated api/.env.example"
fi

# Create .env from .env.example
if [ -f "api/.env.example" ] && [ ! -f "api/.env" ]; then
    cp api/.env.example api/.env
    echo "✓ Created api/.env"
fi

# Update README.md
if [ -f "README.md" ]; then
    sed -i "s/nx-fullstack-template/$PROJECT_NAME/g" README.md
    sed -i "s/app_dev/$DB_NAME/g" README.md
    sed -i "s/app_user/$DB_USER/g" README.md
    sed -i "s/app_dev_password/$DB_PASSWORD/g" README.md
    echo "✓ Updated README.md"
fi

echo ""
echo "==================================="
echo "Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. pnpm install              # Install dependencies"
echo "2. docker compose up -d      # Start PostgreSQL"
echo "3. cd api && pnpm prisma migrate dev --name init  # Create database"
echo "4. pnpm nx serve api         # Start backend (port 3000)"
echo "5. pnpm nx serve web         # Start frontend (port 4200)"
echo ""
echo "Happy coding! 🚀"
