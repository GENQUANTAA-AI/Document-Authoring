"""
LLM content generation using LangChain LCEL
Uses ChatMessageHistory for context from previous sections
"""
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class LLMGenerator:
    """Generates section content using LLM with context from previous sections"""
    
    def __init__(self):
        # ChatOpenAI automatically reads OPENAI_API_KEY from environment
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.7
        )
        # session_id -> in-memory chat history (cleared per document session)
        self.histories: dict = {}
    
    def _get_or_create_history(self, session_id: str) -> InMemoryChatMessageHistory:
        """Get or create chat history for a session"""
        if session_id not in self.histories:
            self.histories[session_id] = InMemoryChatMessageHistory()
        return self.histories[session_id]
    
    def _build_context(self, previous_sections: List[dict]) -> str:
        """
        Build context string from previous sections.
        previous_sections: List of {number, title, content}
        """
        if not previous_sections:
            return ""
        
        context_parts = []
        for section in previous_sections:
            context_parts.append(f"Section {section['number']}: {section['title']}")
            if section.get('content'):
                context_parts.append(section['content'])
            context_parts.append("")  # Empty line between sections
        
        return "\n".join(context_parts)
    
    def generate_section_content(
        self,
        session_id: str,
        section_number: int,
        section_title: str,
        user_brief: str,
        previous_sections: List[dict]
    ) -> str:
        """
        Generate content for a section using LLM.
        
        Args:
            session_id: Session identifier
            section_number: Current section number
            section_title: Title of current section
            user_brief: User's brief for this section
            previous_sections: List of completed sections with content
        
        Returns:
            Generated content as plain text
        """
        history = self._get_or_create_history(session_id)
        
        # Build context from previous sections
        context = self._build_context(previous_sections)
        
        # Build prompt
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert technical writer specializing in Standard Operating Procedures (SOPs) for regulated industries (pharmaceutical, QA, compliance).

Your task is to generate professional, clear, and compliant SOP content based on the user's brief.

IMPORTANT GUIDELINES:
1. Generate content that is appropriate for the section type (e.g., Purpose, Procedure, Responsibilities)
2. Use clear, professional language suitable for regulatory documentation
3. Structure your response based on the content type:
   - For procedures, steps, or lists: Use bullet points with "-" for main items and "--" for sub-items
   - For explanations, descriptions: Use paragraphs
4. DO NOT include markdown formatting
5. DO NOT include section headings or titles
6. DO NOT include numbering (the system will add SOP-style numbering)
7. Maintain consistency with previous sections in style and tone
8. Be specific and actionable
9. Follow regulatory documentation best practices

Previous sections for context:
{context}

Current section: Section {section_number} - {section_title}
User brief: {brief}

Generate the content for this section:"""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{brief}")
        ])
        
        # Get previous messages from history
        previous_messages = history.messages
        
        # Create chain
        chain = prompt_template | self.llm | StrOutputParser()
        
        # Generate content
        result = chain.invoke({
            "context": context,
            "section_number": section_number,
            "section_title": section_title,
            "brief": user_brief,
            "chat_history": previous_messages
        })
        
        # Store in history (only the generated content, not the full conversation)
        history.add_message(HumanMessage(content=f"Section {section_number}: {section_title} - Brief: {user_brief}"))
        history.add_message(AIMessage(content=result))
        
        return result.strip()
    
    def stream_section_content(
        self,
        session_id: str,
        section_number: int,
        section_title: str,
        user_brief: str,
        previous_sections: List[dict]
    ):
        """
        Stream content generation for a section using LLM.
        Yields chunks of text as they are generated.
        
        Args:
            session_id: Session identifier
            section_number: Current section number
            section_title: Title of current section
            user_brief: User's brief for this section
            previous_sections: List of completed sections with content
        
        Yields:
            Text chunks as they are generated
        """
        history = self._get_or_create_history(session_id)
        
        # Build context from previous sections
        context = self._build_context(previous_sections)
        
        # Build prompt
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are an expert technical writer specializing in Standard Operating Procedures (SOPs) for regulated industries (pharmaceutical, QA, compliance).

Your task is to generate professional, clear, and compliant SOP content based on the user's brief.

IMPORTANT GUIDELINES:
1. Generate content that is appropriate for the section type (e.g., Purpose, Procedure, Responsibilities)
2. Use clear, professional language suitable for regulatory documentation
3. Structure your response based on the content type:
   - For procedures, steps, or lists: Use bullet points with "-" for main items and "--" for sub-items
   - For explanations, descriptions: Use paragraphs
4. DO NOT include markdown formatting
5. DO NOT include section headings or titles
6. DO NOT include numbering (the system will add SOP-style numbering)
7. Maintain consistency with previous sections in style and tone
8. Be specific and actionable
9. Follow regulatory documentation best practices

Previous sections for context:
{context}

Current section: Section {section_number} - {section_title}
User brief: {brief}

Generate the content for this section:"""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{brief}")
        ])
        
        # Get previous messages from history
        previous_messages = history.messages
        
        # Create chain with streaming
        chain = prompt_template | self.llm | StrOutputParser()
        
        # Stream content
        full_content = ""
        for chunk in chain.stream({
            "context": context,
            "section_number": section_number,
            "section_title": section_title,
            "brief": user_brief,
            "chat_history": previous_messages
        }):
            full_content += chunk
            yield chunk
        
        # Store in history after streaming is complete
        history.add_message(HumanMessage(content=f"Section {section_number}: {section_title} - Brief: {user_brief}"))
        history.add_message(AIMessage(content=full_content.strip()))
    
    def clear_history(self, session_id: str):
        """Clear history for a session (when starting new document)"""
        if session_id in self.histories:
            del self.histories[session_id]

