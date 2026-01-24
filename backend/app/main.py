"""
FastAPI main application for SOP Document Authoring System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os

from app.routers import upload, generate, status, download, preview, update_content

app = FastAPI(
    title="SOP Document Authoring API",
    description="AI-powered SOP document authoring for regulated industries",
    version="1.0.0"
)

# CORS middleware for frontend
# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(status.router, prefix="/api", tags=["status"])
app.include_router(download.router, prefix="/api", tags=["download"])
app.include_router(preview.router, prefix="/api", tags=["preview"])
app.include_router(update_content.router, prefix="/api", tags=["update"])

@app.get("/")
async def root():
    return {"message": "SOP Document Authoring API", "version": "1.0.0"}

@app.get("/debug/sessions")
async def debug_sessions():
    """Debug endpoint to check active sessions"""
    from app.services import session_manager
    return {
        "session_count": len(session_manager.sessions),
        "session_ids": list(session_manager.sessions.keys()),
        "instance_id": str(id(session_manager))
    }

