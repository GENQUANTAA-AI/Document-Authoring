"""
Generate router for generating section content
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.models import GenerateRequest, SessionStatus
from app.services import session_manager, llm_generator
import json

router = APIRouter()

@router.post("/generate-stream")
async def generate_section_stream(request: GenerateRequest):
    """
    Stream content generation for the current section.
    Returns Server-Sent Events (SSE) with content chunks.
    """
    session = session_manager.get_session(request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.is_complete:
        raise HTTPException(status_code=400, detail="All sections are already completed")
    
    current_section = next(
        (s for s in session.sections if s.number == session.current_section),
        None
    )
    
    if not current_section:
        raise HTTPException(status_code=400, detail="No current section to generate")
    
    # Get previous sections for context
    previous_sections = [
        {
            'number': s.number,
            'title': s.title,
            'content': s.content
        }
        for s in session.sections
        if s.status.value == 'completed' and s.content
    ]
    
    def generate():
        try:
            full_content = ""
            # Stream content from LLM
            for chunk in llm_generator.stream_section_content(
                session_id=request.session_id,
                section_number=current_section.number,
                section_title=current_section.title,
                user_brief=request.brief,
                previous_sections=previous_sections
            ):
                full_content += chunk
                # Send chunk as SSE
                yield f"data: {json.dumps({'chunk': chunk, 'type': 'chunk'})}\n\n"
            
            # Update session with generated content
            session_manager.update_section_content(
                request.session_id,
                current_section.number,
                full_content.strip()
            )
            
            # Get updated session
            updated_session = session_manager.get_session(request.session_id)
            
            # Send completion event
            yield f"data: {json.dumps({'type': 'complete', 'session': updated_session.dict()})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/generate", response_model=SessionStatus)
async def generate_section(request: GenerateRequest):
    """
    Generate content for the current section and advance to next.
    Only one section can be authored at a time (sequential flow).
    """
    # Debug: Log session lookup
    import sys
    print(f"DEBUG: Looking for session_id: {request.session_id}", file=sys.stderr)
    print(f"DEBUG: Session ID type: {type(request.session_id)}", file=sys.stderr)
    print(f"DEBUG: Available sessions: {list(session_manager.sessions.keys())}", file=sys.stderr)
    print(f"DEBUG: Session manager instance ID: {id(session_manager)}", file=sys.stderr)
    print(f"DEBUG: Number of sessions: {len(session_manager.sessions)}", file=sys.stderr)
    
    session = session_manager.get_session(request.session_id)
    if not session:
        available = list(session_manager.sessions.keys())
        raise HTTPException(
            status_code=404, 
            detail=f"Session not found. Requested: '{request.session_id}' (type: {type(request.session_id).__name__}), Available sessions: {available}"
        )
    
    if session.is_complete:
        raise HTTPException(status_code=400, detail="All sections are already completed")
    
    current_section = next(
        (s for s in session.sections if s.number == session.current_section),
        None
    )
    
    if not current_section:
        raise HTTPException(status_code=400, detail="No current section to generate")
    
    # Get previous sections for context
    previous_sections = [
        {
            'number': s.number,
            'title': s.title,
            'content': s.content
        }
        for s in session.sections
        if s.status.value == 'completed' and s.content
    ]
    
    # Generate content using LLM
    try:
        generated_content = llm_generator.generate_section_content(
            session_id=request.session_id,
            section_number=current_section.number,
            section_title=current_section.title,
            user_brief=request.brief,
            previous_sections=previous_sections
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {str(e)}")
    
    # Update session with generated content
    session_manager.update_section_content(
        request.session_id,
        current_section.number,
        generated_content
    )
    
    # Return updated session status
    # Note: Document is generated on-demand when downloading
    updated_session = session_manager.get_session(request.session_id)
    return updated_session

