# Quick Start Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 18+ installed
- OpenAI API key

## Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_key_here" > .env

# Start the server
uvicorn app.main:app --reload --port 8000
```

Backend will be running at: http://localhost:8000

### 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
```

Frontend will be running at: http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Upload a DOCX template file with sections defined by:
   - Word Heading styles (Heading 1, Heading 2), OR
   - ALL CAPS text ending with ":" (e.g., PURPOSE:, PROCEDURE:)
3. Review the detected sections
4. For each section:
   - Enter a brief description
   - Click "Generate & Next"
   - Wait for content generation
   - System automatically advances to next section
5. When all sections are complete, click "Download Final Document"

## Example Template Structure

Your DOCX template should have sections like:

```
PURPOSE:
[Content will be generated here]

SCOPE:
[Content will be generated here]

PROCEDURE:
[Content will be generated here]
```

Or use Word Heading styles:

```
Heading 1: Purpose
[Content will be generated here]

Heading 1: Scope
[Content will be generated here]

Heading 1: Procedure
[Content will be generated here]
```

## Troubleshooting

### Backend Issues

- **Import errors**: Make sure virtual environment is activated and dependencies are installed
- **OpenAI API errors**: Check that OPENAI_API_KEY is set correctly in .env file
- **Port already in use**: Change port in uvicorn command: `--port 8001`

### Frontend Issues

- **API connection errors**: Verify NEXT_PUBLIC_API_URL in .env.local matches backend URL
- **Build errors**: Delete node_modules and .next folder, then run `npm install` again

## API Testing

You can test the API directly:

```bash
# Upload template
curl -X POST "http://localhost:8000/api/upload" \
  -F "file=@your_template.docx"

# Get status (replace SESSION_ID)
curl "http://localhost:8000/api/status/SESSION_ID"

# Generate content (replace SESSION_ID)
curl -X POST "http://localhost:8000/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "SESSION_ID", "brief": "Describe the purpose of this SOP"}'
```

