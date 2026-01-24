# Backend - SOP Document Authoring API

FastAPI backend for the SOP Document Authoring application.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add OPENAI_API_KEY

# Run server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

See [../DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

For Render deployment:
- Uses `render.yaml` for configuration
- Or manually configure with build/start commands in Procfile

## Environment Variables

- `OPENAI_API_KEY`: Required - Your OpenAI API key
- `ALLOWED_ORIGINS`: Optional - Comma-separated CORS origins (defaults to localhost)
