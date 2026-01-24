# Deployment Checklist

Use this checklist to ensure your deployment is complete and working.

## Pre-Deployment

### Code Preparation
- [ ] All code committed to GitHub
- [ ] `.gitignore` properly configured
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Environment variable examples provided (`.env.example`)

### Backend (Render)
- [ ] `render.yaml` configured correctly
- [ ] `requirements.txt` up to date
- [ ] `Procfile` or start command configured
- [ ] CORS settings ready for production URLs

### Frontend (Vercel)
- [ ] `vercel.json` configured (if needed)
- [ ] `package.json` has correct build scripts
- [ ] Environment variables documented

## Deployment Steps

### 1. GitHub
- [ ] Repository created on GitHub
- [ ] Code pushed to main branch
- [ ] Repository is public or Render/Vercel have access

### 2. Render (Backend)
- [ ] Account created and logged in
- [ ] New Web Service created
- [ ] GitHub repository connected
- [ ] Build command: `cd backend && pip install -r requirements.txt`
- [ ] Start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables set:
  - [ ] `OPENAI_API_KEY`
  - [ ] `ALLOWED_ORIGINS` (will update after Vercel deployment)
- [ ] Service deployed successfully
- [ ] Backend URL copied (e.g., `https://xxx.onrender.com`)

### 3. Vercel (Frontend)
- [ ] Account created and logged in
- [ ] New project created
- [ ] GitHub repository imported
- [ ] Root directory set to `frontend`
- [ ] Environment variable set:
  - [ ] `NEXT_PUBLIC_API_URL` = Your Render backend URL
- [ ] Project deployed successfully
- [ ] Frontend URL copied (e.g., `https://xxx.vercel.app`)

### 4. Post-Deployment Configuration
- [ ] Update `ALLOWED_ORIGINS` in Render with Vercel URL
- [ ] Render service redeployed (if needed)
- [ ] Test frontend → backend connection
- [ ] Test file upload
- [ ] Test content generation
- [ ] Test document download

## Testing Checklist

### Functional Tests
- [ ] Upload DOCX template works
- [ ] Sections are detected correctly
- [ ] Content generation works
- [ ] Streaming works (content appears in real-time)
- [ ] Preview updates correctly
- [ ] Content editing works
- [ ] Document download works
- [ ] Content goes to correct sections
- [ ] Tables are filled correctly (if applicable)

### Error Handling
- [ ] Invalid file upload shows error
- [ ] Missing API key shows error
- [ ] Network errors handled gracefully
- [ ] Session expiry handled

## Production Considerations

### Security
- [ ] API keys stored as environment variables (not in code)
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] HTTPS enabled (automatic on Render/Vercel)

### Performance
- [ ] Backend responds in reasonable time
- [ ] Frontend loads quickly
- [ ] Large file uploads work
- [ ] Streaming doesn't timeout

### Monitoring
- [ ] Error logging configured (optional)
- [ ] Monitor Render dashboard for issues
- [ ] Monitor Vercel dashboard for issues

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check build logs in Render
- Verify all dependencies in requirements.txt
- Check Python version compatibility

**Frontend can't connect to backend:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in backend
- Verify backend is running

**CORS errors:**
- Ensure `ALLOWED_ORIGINS` includes your Vercel URL
- Check for trailing slashes in URLs
- Verify protocol (http vs https)

**File upload fails:**
- Check file size limits
- Verify multipart form data handling
- Check Render disk space

## Next Steps

After successful deployment:
1. Test with real users
2. Monitor performance
3. Set up error tracking (optional)
4. Consider adding authentication (if needed)
5. Set up automated backups (if needed)

