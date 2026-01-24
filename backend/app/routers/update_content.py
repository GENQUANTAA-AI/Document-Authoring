"""
Update content router for editing section content
"""
from fastapi import APIRouter, HTTPException
from app.models import SessionStatus
from app.services import session_manager
from pydantic import BaseModel

router = APIRouter()

class UpdateContentRequest(BaseModel):
    session_id: str
    section_number: int
    content: str

@router.post("/update-content", response_model=SessionStatus)
async def update_section_content(request: UpdateContentRequest):
    """
    Update content for a section (for editing).
    """
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Find the section
    section = next(
        (s for s in session.sections if s.number == request.section_number),
        None
    )
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Update the content
    section.content = request.content
    
    # Return updated session
    return session

