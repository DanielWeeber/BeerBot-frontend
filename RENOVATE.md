# Renovate Setup Instructions

This repository uses [Renovate](https://github.com/renovatebot/renovate) for automated dependency management.

## Setup

1. **Enable Renovate App:**
   - Go to [GitHub Renovate App](https://github.com/apps/renovate)
   - Click "Install" and select your repositories
   - Choose "Selected repositories" and include this repo

2. **Create Personal Access Token (if using self-hosted):**
   - Go to GitHub Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Create token with repository permissions:
     - Contents: Read and Write
     - Issues: Write
     - Pull requests: Write
     - Metadata: Read
   - Add token as repository secret: `RENOVATE_TOKEN`

3. **Configuration:**
   - Renovate configuration is in `renovate.json`
   - Runs weekly on Monday at 2 AM UTC
   - Auto-merges patch/minor updates after 1-3 days
   - Groups major updates by ecosystem (React, Next.js, TypeScript)

## Features

- 🔄 **Automatic Updates**: npm packages, GitHub Actions, Docker images
- 🛡️ **Security Alerts**: Vulnerability detection and fixes  
- 📊 **Dependency Dashboard**: Overview of all dependencies
- ⚡ **Smart Grouping**: Related updates bundled by ecosystem
- 🚀 **Auto-merge**: Safe updates merged automatically
- 📝 **Semantic Commits**: Proper commit message formatting
- 🔒 **Lockfile Maintenance**: Regular package-lock.json updates

## Customization

Edit `renovate.json` to adjust:

- Update schedules
- Auto-merge rules  
- Package grouping
- PR limits and timing