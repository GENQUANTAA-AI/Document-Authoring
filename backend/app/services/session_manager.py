"""
Session manager for handling document authoring sessions
"""
import uuid
import os
from typing import Dict, Optional
from app.models import Section, SectionStatus, SessionStatus
from app.services.section_extractor import SectionExtractor

class SessionManager:
    """Manages document authoring sessions"""
    
    def __init__(self, sessions_dir: str = None):
        # Use environment variable or default to sessions directory
        if sessions_dir is None:
            sessions_dir = os.getenv("SESSIONS_DIR", "sessions")
        self.sessions_dir = sessions_dir
        self.sessions: Dict[str, SessionStatus] = {}
        os.makedirs(sessions_dir, exist_ok=True)
    
    def create_session(self, docx_path: str) -> str:
        """
        Create a new session from uploaded DOCX template
        Returns session_id
        """
        session_id = str(uuid.uuid4())
        session_path = os.path.join(self.sessions_dir, session_id)
        os.makedirs(session_path, exist_ok=True)
        
        # Extract sections
        sections_data = SectionExtractor.extract_sections(docx_path)
        
        # Create Section objects
        sections = [
            Section(
                number=i + 1,
                title=title,
                status=SectionStatus.PENDING,
                content=None
            )
            for i, (title, _) in enumerate(sections_data)
        ]
        
        # Copy template to session directory
        import shutil
        template_path = os.path.join(session_path, "template.docx")
        shutil.copy(docx_path, template_path)
        
        # Store section indices and titles for later use
        section_indices = {i + 1: idx for i, (_, idx) in enumerate(sections_data)}
        section_titles = {i + 1: title for i, (title, _) in enumerate(sections_data)}
        
        # Create session status
        session_status = SessionStatus(
            session_id=session_id,
            total_sections=len(sections),
            current_section=1 if sections else 0,
            progress=0.0,
            sections=sections,
            is_complete=False
        )
        
        # Store additional metadata
        session_status._section_indices = section_indices
        session_status._section_titles = section_titles
        session_status._template_path = template_path
        
        self.sessions[session_id] = session_status
        
        return session_id
    
    def get_session(self, session_id: str) -> Optional[SessionStatus]:
        """Get session status"""
        return self.sessions.get(session_id)
    
    def update_section_content(self, session_id: str, section_number: int, content: str):
        """Update content for a completed section"""
        session = self.sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")
        
        # Update section content and status
        for section in session.sections:
            if section.number == section_number:
                section.content = content
                section.status = SectionStatus.COMPLETED
                break
        
        # Advance to next section
        if section_number < session.total_sections:
            session.current_section = section_number + 1
            # Mark next section as in progress
            for section in session.sections:
                if section.number == session.current_section:
                    section.status = SectionStatus.IN_PROGRESS
                    break
        else:
            # All sections completed
            session.is_complete = True
            session.current_section = 0
        
        # Update progress
        completed = sum(1 for s in session.sections if s.status == SectionStatus.COMPLETED)
        session.progress = completed / session.total_sections if session.total_sections > 0 else 0.0
    
    def get_template_path(self, session_id: str) -> Optional[str]:
        """Get path to template DOCX for a session"""
        session = self.sessions.get(session_id)
        if session and hasattr(session, '_template_path'):
            return session._template_path
        return None
    
    def get_section_indices(self, session_id: str) -> Dict[int, int]:
        """Get section paragraph indices"""
        session = self.sessions.get(session_id)
        if session and hasattr(session, '_section_indices'):
            return session._section_indices
        return {}
    
    def get_section_titles(self, session_id: str) -> Dict[int, str]:
        """Get section titles"""
        session = self.sessions.get(session_id)
        if session and hasattr(session, '_section_titles'):
            return session._section_titles
        return {}

