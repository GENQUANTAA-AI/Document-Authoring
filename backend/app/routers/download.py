"""
Download router for downloading final document
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services import session_manager
from app.services.docx_writer import DOCXWriter
import os

router = APIRouter()

@router.get("/download/{session_id}")
async def download_document(session_id: str):
    """
    Download the final document with all generated content.
    Only available when all sections are completed.
    """
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if not session.is_complete:
        raise HTTPException(
            status_code=400,
            detail="Document is not complete. Please complete all sections first."
        )
    
    template_path = session_manager.get_template_path(session_id)
    section_indices = session_manager.get_section_indices(session_id)
    section_titles = session_manager.get_section_titles(session_id)
    
    if not template_path or not section_indices:
        raise HTTPException(status_code=500, detail="Session data corrupted")
    
    # Prepare sections data with titles
    sections_data = [
        {
            'number': s.number,
            'title': section_titles.get(s.number, s.title),
            'content': s.content
        }
        for s in session.sections
        if s.content
    ]
    
    # Create final document
    output_path = os.path.join(
        os.path.dirname(template_path),
        "final_document.docx"
    )
    
    DOCXWriter.create_final_document(
        template_path=template_path,
        sections=sections_data,
        section_indices=section_indices,
        output_path=output_path
    )
    
    if not os.path.exists(output_path):
        raise HTTPException(status_code=500, detail="Failed to generate document")
    
    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="SOP_Document.docx"
    )

