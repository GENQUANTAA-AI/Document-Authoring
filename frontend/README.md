# Frontend - SOP Document Authoring UI

Next.js frontend for the SOP Document Authoring application.

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL

# Run development server
npm run dev
```

Visit http://localhost:3000

## Deployment

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

For Vercel deployment:
- Vercel auto-detects Next.js
- Set `NEXT_PUBLIC_API_URL` environment variable
- Root directory: `frontend` (if deploying from monorepo)

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Required - Backend API URL
  - Local: `http://localhost:8000`
  - Production: Your Render backend URL

## Build

```bash
npm run build
npm start
```
