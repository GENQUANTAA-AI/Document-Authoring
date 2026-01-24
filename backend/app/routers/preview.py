"""
Preview router for getting document preview
"""
from fastapi import APIRouter, HTTPException
from app.services import session_manager
from typing import List, Dict

router = APIRouter()

@router.get("/preview/{session_id}")
async def get_document_preview(session_id: str):
    """
    Get document preview as structured text for display.
    Returns sections with their content from session.
    """
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Build preview structure from session data
    preview_sections: List[Dict] = []
    
    for section in session.sections:
        section_data = {
            'number': section.number,
            'title': section.title,
            'status': section.status.value,
            'content': section.content or ''
        }
        preview_sections.append(section_data)
    
    return {
        'sections': preview_sections,
        'total_sections': session.total_sections,
        'current_section': session.current_section
    }

