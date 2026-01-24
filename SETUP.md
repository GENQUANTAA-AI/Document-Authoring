# Setup Instructions

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add OPENAI_API_KEY
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running Locally

### Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

Visit http://localhost:3000

## Deployment Checklist

### Before Deploying

- [ ] Update `render.yaml` with correct paths
- [ ] Update `frontend/vercel.json` if needed
- [ ] Set all environment variables in Render
- [ ] Set all environment variables in Vercel
- [ ] Test locally with production-like settings
- [ ] Update CORS settings after getting production URLs

### Environment Variables

**Render (Backend)**:
- `OPENAI_API_KEY` - Your OpenAI API key
- `ALLOWED_ORIGINS` - Your Vercel frontend URL (comma-separated)

**Vercel (Frontend)**:
- `NEXT_PUBLIC_API_URL` - Your Render backend URL

## Post-Deployment

1. Get your Render backend URL
2. Get your Vercel frontend URL
3. Update `ALLOWED_ORIGINS` in Render with Vercel URL
4. Update `NEXT_PUBLIC_API_URL` in Vercel with Render URL
5. Test the application end-to-end

