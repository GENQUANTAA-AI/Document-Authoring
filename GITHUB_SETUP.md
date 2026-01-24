# GitHub Setup Guide

## Initial Repository Setup

### 1. Initialize Git (if not already done)

```bash
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: SOP Document Authoring Application"
```

### 4. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)

### 5. Connect and Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Repository Structure

Your repository should have:

```
.
├── backend/              # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   ├── Procfile
│   ├── runtime.txt
│   └── .env.example
├── frontend/             # Next.js frontend
│   ├── app/
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
├── .gitignore
├── render.yaml           # Render deployment config
├── README.md
├── DEPLOYMENT.md
└── LICENSE
```

## Important Notes

- **Never commit**:
  - `.env` files
  - `node_modules/`
  - `venv/` or `myenv/`
  - `sessions/` directory
  - `*.docx` files
  - API keys or secrets

- **Always commit**:
  - `.env.example` files
  - Configuration files
  - Source code
  - Documentation

## Next Steps

After pushing to GitHub:
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy on Render and Vercel
2. Set up environment variables in both platforms
3. Test the deployed application

