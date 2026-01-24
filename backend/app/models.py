"""
Data models for the SOP authoring system
"""
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class SectionStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Section(BaseModel):
    number: int
    title: str
    status: SectionStatus
    content: Optional[str] = None

class SessionStatus(BaseModel):
    session_id: str
    total_sections: int
    current_section: int
    progress: float  # 0.0 to 1.0
    sections: List[Section]
    is_complete: bool

class GenerateRequest(BaseModel):
    session_id: str
    brief: str

class UploadResponse(BaseModel):
    session_id: str
    total_sections: int
    sections: List[Section]

