"""
Status router for getting session status
"""
from fastapi import APIRouter, HTTPException
from app.models import SessionStatus
from app.services import session_manager

router = APIRouter()

@router.get("/status/{session_id}", response_model=SessionStatus)
async def get_status(session_id: str):
    """
    Get current status of a session.
    Returns current section, progress, and all sections.
    """
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session

