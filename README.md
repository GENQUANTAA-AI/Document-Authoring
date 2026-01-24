# SOP Document Authoring Application

A production-grade AI-powered SOP (Standard Operating Procedure) document authoring application for regulated industries (pharma, QA, compliance).

## Features

- **Guided Document Authoring**: Sequential section-by-section authoring with AI assistance
- **Real-time Streaming**: See content generated in real-time as the LLM writes
- **Section Validation**: Ensures content goes to the correct sections
- **Table Support**: Automatically detects and fills tables (annexures, formats, etc.)
- **Live Preview**: Real-time document preview with editing capabilities
- **SOP-Style Numbering**: Automatic numbering (N.1, N.2, N.3.1, etc.)
- **Professional UI**: Enterprise-ready interface (not a chatbot)

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **LangChain LCEL**: LLM orchestration
- **OpenAI GPT-4**: Content generation
- **python-docx**: Document manipulation

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Axios**: HTTP client

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI application
│   │   ├── models.py     # Pydantic models
│   │   ├── routers/      # API endpoints
│   │   └── services/     # Business logic
│   ├── requirements.txt
│   └── Procfile          # Render deployment
├── frontend/             # Next.js frontend
│   ├── app/
│   │   ├── components/   # React components
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json
│   └── vercel.json       # Vercel deployment
├── render.yaml           # Render configuration
├── vercel.json          # Vercel configuration
└── README.md
```

## Local Development

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

5. Run server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL
```

4. Run development server:
```bash
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Render)**:
1. Push code to GitHub (see [GITHUB_SETUP.md](./GITHUB_SETUP.md))
2. Connect GitHub repository to Render
3. Render will auto-detect `render.yaml` or configure manually:
   - Build: `cd backend && pip install -r requirements.txt`
   - Start: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables: `OPENAI_API_KEY`, `ALLOWED_ORIGINS`

**Frontend (Vercel)**:
1. Import GitHub repository to Vercel
2. Set root directory: `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL` (your Render backend URL)
4. Deploy

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step instructions.**

## API Endpoints

- `POST /api/upload` - Upload DOCX template and create session
- `GET /api/status/{session_id}` - Get session status
- `POST /api/generate-stream` - Stream content generation (SSE)
- `POST /api/generate` - Generate content (non-streaming)
- `GET /api/preview/{session_id}` - Get document preview
- `POST /api/update-content` - Update section content
- `GET /api/download/{session_id}` - Download final document

## Environment Variables

### Backend
- `OPENAI_API_KEY` (required): OpenAI API key
- `ALLOWED_ORIGINS` (optional): Comma-separated CORS origins

### Frontend
- `NEXT_PUBLIC_API_URL` (required): Backend API URL

## License

Proprietary - For internal use only
