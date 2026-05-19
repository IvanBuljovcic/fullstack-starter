# GitHub Template Setup Instructions

Follow these steps to publish this as a GitHub template repository.

## Step 1: Create GitHub Repository

### Option A: GitHub CLI (Recommended)

```bash
cd C:\Projects\Private\nx-fullstack-template

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial template setup with NestJS, Next.js, Prisma, and PostgreSQL"

# Create GitHub repository (replace YOUR_USERNAME)
gh repo create nx-fullstack-template --public --source=. --push

# Enable template feature
gh repo edit --enable-template
```

### Option B: GitHub Web Interface

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `nx-fullstack-template`
   - Description: `Production-ready Nx monorepo with NestJS, Next.js, Prisma, and PostgreSQL`
   - Make it **Public**
   - Do NOT initialize with README (we already have one)

2. **Push your local repository**
   ```bash
   cd C:\Projects\Private\nx-fullstack-template
   git init
   git add .
   git commit -m "feat: initial template setup with NestJS, Next.js, Prisma, and PostgreSQL"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nx-fullstack-template.git
   git push -u origin main
   ```

3. **Enable template feature**
   - Go to repository Settings
   - Check "Template repository" checkbox
   - Save changes

## Step 2: Configure Repository Settings

### General Settings

1. Navigate to **Settings** → **General**
2. Configure:
   - **Description**: "Production-ready Nx monorepo with NestJS, Next.js, Prisma, and PostgreSQL"
   - **Website**: Your documentation site (optional)
   - **Topics**: `nx`, `nestjs`, `nextjs`, `prisma`, `postgresql`, `typescript`, `monorepo`, `template`, `fullstack`
   - **Enable**: Issues, Discussions
   - **Disable**: Wiki, Projects (optional)
   - **Template repository**: ✅ Checked

### Branch Protection (Recommended)

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - Require pull request reviews before merging
   - Require status checks to pass (CI tests)
   - Require branches to be up to date
   - Include administrators (optional)

### Enable Discussions

1. Go to **Settings** → **General**
2. Under **Features**, enable **Discussions**
3. Create categories:
   - General
   - Q&A
   - Ideas
   - Show and tell

## Step 3: Customize for Your GitHub Account

Update these files with your GitHub username:

### README.md
```bash
# Replace YOUR_USERNAME with your actual username
sed -i 's/YOUR_USERNAME/actual-username/g' README.md
```

### .github/ISSUE_TEMPLATE/config.yml
```yaml
contact_links:
  - name: Question or Discussion
    url: https://github.com/YOUR_USERNAME/nx-fullstack-template/discussions
```

### TEMPLATE_INFO.md
Update all instances of `YOUR_USERNAME` with your actual GitHub username.

## Step 4: Test the Template

### Test Template Creation

1. Click the **"Use this template"** button on your repository
2. Create a test repository
3. Clone the test repository
4. Run the initialization script:
   ```bash
   ./init-template.sh
   ```
5. Verify everything works:
   ```bash
   pnpm install
   docker compose up -d
   cd api && pnpm prisma migrate dev --name init
   pnpm nx serve api
   ```

6. If everything works, delete the test repository

## Step 5: Create Initial Release

### Tag the Initial Version

```bash
git tag -a v1.0.0 -m "feat: initial template release with NestJS, Next.js, Prisma, and PostgreSQL"
git push origin v1.0.0
```

### Create GitHub Release

1. Go to **Releases** → **Create a new release**
2. Choose tag: `v1.0.0`
3. Release title: `v1.0.0 - Initial Template Release`
4. Description:
   ```markdown
   # Nx Full-Stack Template v1.0.0

   Production-ready monorepo template for building full-stack TypeScript applications.

   ## Features
   - ✅ Nx 22.5 monorepo with intelligent caching
   - ✅ NestJS 11 backend with TypeScript
   - ✅ Next.js 16 + React 19 frontend
   - ✅ Prisma 5 with PostgreSQL 16
   - ✅ Example models and API endpoints
   - ✅ Docker Compose setup
   - ✅ CI/CD workflow included
   - ✅ Code quality tools (Biome, Husky)
   - ✅ Initialization scripts for easy setup

   ## Quick Start
   1. Click "Use this template" button
   2. Clone your new repository
   3. Run `./init-template.sh` (or `.ps1` on Windows)
   4. Follow the prompts
   5. Start building!

   See [SETUP.md](https://github.com/YOUR_USERNAME/nx-fullstack-template/blob/main/SETUP.md) for detailed instructions.

   ## What's Included
   - Complete NestJS API with Prisma integration
   - Next.js web application with App Router
   - Example User/Post models with CRUD operations
   - PostgreSQL database via Docker Compose
   - E2E testing setup with Playwright
   - GitHub Actions CI/CD pipeline
   - Issue and PR templates

   **Full documentation**: [README.md](https://github.com/YOUR_USERNAME/nx-fullstack-template)
   ```
5. Click **Publish release**

## Step 6: Add Template Badge to README

Add this badge to the top of your README.md:

```markdown
[![Use this template](https://img.shields.io/badge/use%20this-template-blue?logo=github)](https://github.com/YOUR_USERNAME/nx-fullstack-template/generate)
```

## Step 7: Promote Your Template

### Add Topics

On your repository page, click **⚙️** next to "About" and add these topics:
- `nx-monorepo`
- `nestjs-template`
- `nextjs-template`
- `prisma-template`
- `fullstack-template`
- `typescript-template`
- `github-template`
- `starter-template`

### Share

- Tweet about it
- Post on Reddit (r/typescript, r/webdev)
- Share in relevant Discord/Slack communities
- Add to Awesome lists

## Maintenance Tasks

### Regular Updates

Schedule regular maintenance:

1. **Weekly**: Check for security updates
   ```bash
   pnpm audit
   ```

2. **Monthly**: Update dependencies
   ```bash
   pnpm update --latest
   pnpm check
   pnpm nx run-many -t build,test
   ```

3. **Quarterly**: Review and improve documentation

### Version Updates

When making significant changes:

1. Update version in `package.json`
2. Update CHANGELOG.md (create if needed)
3. Create new git tag
4. Create GitHub release with changelog

## Repository Structure Checklist

Ensure all these files exist:

- [x] README.md - Main documentation
- [x] SETUP.md - Detailed setup guide
- [x] CONTRIBUTING.md - Contribution guidelines
- [x] TEMPLATE_INFO.md - Template usage info
- [x] LICENSE - MIT license
- [x] .gitignore - Git ignore rules
- [x] .gitattributes - Git attributes
- [x] docker-compose.yml - PostgreSQL setup
- [x] init-template.sh - Linux/Mac setup script
- [x] init-template.ps1 - Windows setup script
- [x] .github/workflows/ci.yml - CI/CD pipeline
- [x] .github/ISSUE_TEMPLATE/ - Issue templates
- [x] .github/PULL_REQUEST_TEMPLATE.md - PR template

## Verification Checklist

Before making the template public:

- [ ] All documentation is accurate and up-to-date
- [ ] Example code compiles and runs
- [ ] Initialization scripts work on Linux/Mac/Windows
- [ ] CI/CD workflow passes
- [ ] Database migrations work correctly
- [ ] All npm scripts execute successfully
- [ ] Template creation process works end-to-end
- [ ] Repository is marked as template
- [ ] Topics and description are set
- [ ] License is specified
- [ ] README badges are working
- [ ] Links in documentation are valid

## Congratulations!

Your template is now ready for the world! 🎉

Users can now click "Use this template" to create their own projects based on your work.

---

**Next Steps:**
- Monitor issues and discussions
- Respond to questions and feedback
- Continuously improve based on user feedback
- Keep dependencies updated
- Share your template with the community
