"""
Shared service instances
"""
from app.services.session_manager import SessionManager
from app.services.llm_generator import LLMGenerator

# Create shared singleton instances
session_manager = SessionManager()
llm_generator = LLMGenerator()

