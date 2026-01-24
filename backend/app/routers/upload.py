"""
Upload router for handling DOCX template uploads
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import UploadResponse, Section
from app.services import session_manager
import tempfile
import os

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_template(file: UploadFile = File(...)):
    """
    Upload a DOCX SOP template and create a new session.
    Returns session_id and detected sections.
    """
    # Validate file type
    if not file.filename.endswith('.docx'):
        raise HTTPException(status_code=400, detail="Only .docx files are supported")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp_file:
        content = await file.read()
        tmp_file.write(content)
        tmp_path = tmp_file.name
    
    try:
        # Create session
        session_id = session_manager.create_session(tmp_path)
        session = session_manager.get_session(session_id)
        
        # Debug: Log session creation
        print(f"DEBUG: Created session_id: {session_id}")
        print(f"DEBUG: Total sessions now: {len(session_manager.sessions)}")
        print(f"DEBUG: Session keys: {list(session_manager.sessions.keys())}")
        
        if not session:
            raise HTTPException(status_code=500, detail="Failed to create session")
        
        return UploadResponse(
            session_id=session_id,
            total_sections=session.total_sections,
            sections=session.sections
        )
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

