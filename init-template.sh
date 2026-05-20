#!/bin/bash

# Full-Stack Starter Template Initialization Script
# This script helps you customize the template for your project

echo "=========================================="
echo " Full-Stack Starter Template Setup"
echo "=========================================="
echo ""

# Get project name
read -p "Enter your project name (e.g., my-awesome-app): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    echo "Error: Project name cannot be empty. Exiting."
    exit 1
fi

# Validate project name (alphanumeric, hyphens, underscores only)
if ! [[ "$PROJECT_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "Error: Project name can only contain letters, numbers, hyphens, and underscores."
    exit 1
fi

# Get organization/scope name
read -p "Enter organization name for packages (default: starter): " ORG_NAME
ORG_NAME=${ORG_NAME:-"starter"}

# Get database configuration
DB_NAME_DEFAULT="${PROJECT_NAME}_dev"
read -p "Enter database name (default: ${DB_NAME_DEFAULT}): " DB_NAME
DB_NAME=${DB_NAME:-"${DB_NAME_DEFAULT}"}

DB_USER_DEFAULT="${PROJECT_NAME}_user"
read -p "Enter database user (default: ${DB_USER_DEFAULT}): " DB_USER
DB_USER=${DB_USER:-"${DB_USER_DEFAULT}"}

DB_PASSWORD_DEFAULT="${PROJECT_NAME}_password"
read -p "Enter database password (default: ${DB_PASSWORD_DEFAULT}): " DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-"${DB_PASSWORD_DEFAULT}"}

# Get port configuration
read -p "Enter API port (default: 3000): " API_PORT
API_PORT=${API_PORT:-"3000"}

read -p "Enter Web port (default: 4200): " WEB_PORT
WEB_PORT=${WEB_PORT:-"4200"}

read -p "Enter database port (default: 5433): " DB_PORT
DB_PORT=${DB_PORT:-"5433"}

echo ""
echo "=========================================="
echo " Configuration Summary"
echo "=========================================="
echo "Project Name:     $PROJECT_NAME"
echo "Organization:     @$ORG_NAME"
echo "Database Name:    $DB_NAME"
echo "Database User:    $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo "API Port:         $API_PORT"
echo "Web Port:         $WEB_PORT"
echo "Database Port:    $DB_PORT"
echo "=========================================="
echo ""

read -p "Is this correct? (Y/n): " CONFIRM
CONFIRM=${CONFIRM:-"y"}
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Setup cancelled."
    exit 0
fi

echo ""
echo "Updating configuration files..."
echo ""

# Update package.json
if [ -f "package.json" ]; then
    sed -i "s/\"name\": \"fullstack-starter\"/\"name\": \"$PROJECT_NAME\"/" package.json
    echo "  [OK] Updated package.json"
fi

# Update api/package.json
if [ -f "api/package.json" ]; then
    sed -i "s/@starter/@$ORG_NAME/g" api/package.json
    echo "  [OK] Updated api/package.json"
fi

# Update web/package.json
if [ -f "web/package.json" ]; then
    sed -i "s/@starter/@$ORG_NAME/g" web/package.json
    # Update dev script to use the chosen port
    sed -i "s/\"dev\": \"next dev --turbopack\"/\"dev\": \"next dev --turbopack --port $WEB_PORT\"/" web/package.json
    sed -i "s/\"dev\": \"next dev\"/\"dev\": \"next dev --port $WEB_PORT\"/" web/package.json
    echo "  [OK] Updated web/package.json"
fi

# Update libs/shared/types/package.json
if [ -f "libs/shared/types/package.json" ]; then
    sed -i "s/@starter/@$ORG_NAME/g" libs/shared/types/package.json
    echo "  [OK] Updated libs/shared/types/package.json"
fi

# Update tsconfig.base.json
if [ -f "tsconfig.base.json" ]; then
    sed -i "s/@starter/@$ORG_NAME/g" tsconfig.base.json
    echo "  [OK] Updated tsconfig.base.json"
fi

# Update docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    sed -i "s/container_name: starter-postgres/container_name: ${PROJECT_NAME}-postgres/" docker-compose.yml
    sed -i "s/POSTGRES_DB: starter_dev/POSTGRES_DB: $DB_NAME/" docker-compose.yml
    sed -i "s/POSTGRES_USER: starter_user/POSTGRES_USER: $DB_USER/" docker-compose.yml
    sed -i "s/POSTGRES_PASSWORD: starter_password/POSTGRES_PASSWORD: $DB_PASSWORD/" docker-compose.yml
    sed -i "s/'[0-9]*:5432'/'${DB_PORT}:5432'/" docker-compose.yml
    sed -i "s/pg_isready -U starter_user -d starter_dev/pg_isready -U $DB_USER -d $DB_NAME/" docker-compose.yml
    echo "  [OK] Updated docker-compose.yml"
fi

# Update api/.env.example
if [ -f "api/.env.example" ]; then
    DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" api/.env.example
    sed -i "s/PORT=[0-9]*/PORT=$API_PORT/" api/.env.example
    sed -i "s|CORS_ORIGIN=.*|CORS_ORIGIN=http://localhost:$WEB_PORT|" api/.env.example
    echo "  [OK] Updated api/.env.example"
fi

# Update api/.env.test
if [ -f "api/.env.test" ]; then
    TEST_DB_NAME="${DB_NAME//_dev/_test}"
    TEST_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${TEST_DB_NAME}?schema=public"
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=$TEST_DATABASE_URL|" api/.env.test
    sed -i "s|CORS_ORIGIN=.*|CORS_ORIGIN=http://localhost:$WEB_PORT|" api/.env.test
    echo "  [OK] Updated api/.env.test"
fi

# Create api/.env from api/.env.example
if [ -f "api/.env.example" ] && [ ! -f "api/.env" ]; then
    cp api/.env.example api/.env
    echo "  [OK] Created api/.env"
elif [ -f "api/.env" ]; then
    echo "  [SKIP] api/.env already exists"
fi

# Update README.md
if [ -f "README.md" ]; then
    sed -i "s/fullstack-starter/$PROJECT_NAME/g" README.md
    sed -i "s/starter_dev/$DB_NAME/g" README.md
    sed -i "s/starter_user/$DB_USER/g" README.md
    sed -i "s/starter_password/$DB_PASSWORD/g" README.md
    sed -i "s/:3000/:$API_PORT/g" README.md
    sed -i "s/:4200/:$WEB_PORT/g" README.md
    sed -i "s/:5433/:$DB_PORT/g" README.md
    echo "  [OK] Updated README.md"
fi

# Handle git remote
if [ -d ".git" ]; then
    echo ""
    echo "Git repository detected."
    read -p "Do you want to remove the template's git remote? (Y/n): " REMOVE_REMOTE
    REMOVE_REMOTE=${REMOVE_REMOTE:-"y"}

    if [ "$REMOVE_REMOTE" = "y" ] || [ "$REMOVE_REMOTE" = "Y" ]; then
        git remote remove origin 2>/dev/null
        echo "  [OK] Removed template's git remote"
        echo ""
        echo "  To add your own repository:"
        echo "  git remote add origin <your-repository-url>"
    fi
fi

echo ""
echo "=========================================="
echo " Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "  1. pnpm install"
echo "     Install dependencies"
echo ""
echo "  2. docker compose up -d"
echo "     Start PostgreSQL container"
echo ""
echo "  3. cd api; npx prisma migrate dev --name init"
echo "     Initialize database schema"
echo ""
echo "  4. pnpm nx serve api"
echo "     Start backend API (http://localhost:$API_PORT)"
echo ""
echo "  5. pnpm nx dev web"
echo "     Start frontend (http://localhost:$WEB_PORT)"
echo ""
echo "Documentation:"
echo "  - SETUP.md - Detailed setup instructions"
echo "  - CUSTOMIZATION.md - Guide to customizing the template"
echo "  - TEMPLATE_GUIDE.md - Architecture and best practices"
echo ""
echo "Happy coding!"
echo ""
