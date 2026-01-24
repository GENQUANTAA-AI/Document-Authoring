# Deployment Guide

This guide covers deploying the SOP Document Authoring application to production.

## Architecture

- **Backend**: FastAPI on Render
- **Frontend**: Next.js on Vercel

## Prerequisites

1. GitHub account
2. Render account (for backend)
3. Vercel account (for frontend)
4. OpenAI API key

## Step 1: Push to GitHub

1. Initialize git repository (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend on Render

### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)

2. Click "New +" → "Blueprint"

3. Connect your GitHub repository

4. Render will automatically detect `render.yaml` and configure the service

5. Add Environment Variables in the dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

6. Click "Apply"

7. Wait for deployment to complete

8. Copy the service URL (e.g., `https://sop-authoring-backend.onrender.com`)

### Option B: Manual Configuration

1. Go to [Render Dashboard](https://dashboard.render.com)

2. Click "New +" → "Web Service"

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: `sop-authoring-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

6. Click "Create Web Service"

7. Wait for deployment to complete

8. Copy the service URL (e.g., `https://sop-authoring-backend.onrender.com`)

## Step 3: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)

2. Click "Add New..." → "Project"

3. Import your GitHub repository

4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (or leave default)
   - **Output Directory**: `.next` (or leave default)

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://sop-authoring-backend.onrender.com`)

6. Click "Deploy"

7. Wait for deployment to complete

8. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

## Step 4: Update CORS Settings

1. Go back to Render dashboard

2. Edit your backend service

3. Update `ALLOWED_ORIGINS` environment variable:
   - Add your Vercel URL: `https://your-app.vercel.app`
   - You can add multiple URLs separated by commas

4. Save and redeploy

## Step 5: Update Vercel Configuration (Optional)

If you want to use Vercel's rewrite feature instead of direct API calls:

1. Edit `vercel.json` in your repository
2. Update the `rewrites` destination with your Render backend URL
3. Update `env.NEXT_PUBLIC_API_URL` with your Render backend URL
4. Commit and push changes
5. Vercel will automatically redeploy

## Environment Variables Summary

### Backend (Render)
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs (required)
- `PYTHON_VERSION`: Python version (optional, defaults to 3.11.0)

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (required)

## Troubleshooting

### Backend Issues

1. **Port binding error**: Make sure you're using `$PORT` environment variable
2. **Import errors**: Check that all dependencies are in `requirements.txt`
3. **CORS errors**: Verify `ALLOWED_ORIGINS` includes your Vercel URL

### Frontend Issues

1. **API connection errors**: Verify `NEXT_PUBLIC_API_URL` is set correctly
2. **Build errors**: Check that all dependencies are in `package.json`
3. **Environment variables**: Remember that Next.js requires `NEXT_PUBLIC_` prefix for client-side variables

## Production Considerations

1. **Session Storage**: Currently using in-memory storage. For production, consider:
   - Redis for session storage
   - Database for persistent storage
   - File system with proper cleanup

2. **File Uploads**: Consider using:
   - Cloud storage (S3, Cloudinary) for uploaded files
   - Temporary file cleanup

3. **Rate Limiting**: Add rate limiting to prevent abuse

4. **Monitoring**: Set up logging and monitoring (e.g., Sentry)

5. **SSL/HTTPS**: Both Render and Vercel provide HTTPS by default

## Updating Deployments

### Backend
- Push changes to GitHub
- Render will automatically detect and redeploy

### Frontend
- Push changes to GitHub
- Vercel will automatically detect and redeploy

## Cost Considerations

- **Render**: Free tier available (spins down after inactivity)
- **Vercel**: Free tier available with generous limits
- **OpenAI API**: Pay-per-use based on tokens

