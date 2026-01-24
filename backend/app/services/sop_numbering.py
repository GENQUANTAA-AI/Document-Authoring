"""
SOP-style numbering logic
For section N:
- Main bullets → N.1, N.2, N.3...
- Sub-bullets → N.3.1, N.3.2...
"""
import re
from typing import List

class SOPNumbering:
    """Handles SOP-style numbering for generated content"""
    
    @staticmethod
    def apply_numbering(content: str, section_number: int) -> str:
        """
        Apply SOP-style numbering to content.
        Assumes LLM generates:
        - "-" for main steps
        - "--" for sub-steps
        """
        lines = content.split('\n')
        numbered_lines = []
        main_counter = 1
        sub_counter = None
        last_main_number = None
        
        for line in lines:
            stripped = line.strip()
            
            # Empty line - preserve it
            if not stripped:
                numbered_lines.append('')
                continue
            
            # Sub-bullet (starts with "--")
            if stripped.startswith('--'):
                if sub_counter is None:
                    sub_counter = 1
                # Remove "--" and apply numbering
                content_text = stripped[2:].strip()
                numbered_text = f"{section_number}.{last_main_number}.{sub_counter} {content_text}"
                numbered_lines.append(numbered_text)
                sub_counter += 1
            
            # Main bullet (starts with "-")
            elif stripped.startswith('-'):
                # Reset sub-counter when new main bullet appears
                sub_counter = None
                # Remove "-" and apply numbering
                content_text = stripped[1:].strip()
                numbered_text = f"{section_number}.{main_counter} {content_text}"
                numbered_lines.append(numbered_text)
                last_main_number = main_counter
                main_counter += 1
            
            # Regular paragraph - preserve as is
            else:
                numbered_lines.append(line)
                # Reset counters for new paragraph block
                if main_counter > 1:
                    main_counter = 1
                    sub_counter = None
                    last_main_number = None
        
        return '\n'.join(numbered_lines)
    
    @staticmethod
    def split_into_paragraphs_and_bullets(content: str) -> List[dict]:
        """
        Split content into structured elements:
        - paragraphs (regular text)
        - bullet lists (with main and sub items)
        After numbering, bullets have format: "N.M text" or "N.M.P text"
        """
        lines = content.split('\n')
        elements = []
        current_paragraph = []
        current_bullet_list = []
        
        for line in lines:
            stripped = line.strip()
            
            if not stripped:
                # Empty line - close current element
                if current_paragraph:
                    elements.append({'type': 'paragraph', 'content': '\n'.join(current_paragraph)})
                    current_paragraph = []
                if current_bullet_list:
                    elements.append({'type': 'bullet_list', 'items': current_bullet_list})
                    current_bullet_list = []
                continue
            
            # Check if line is a numbered bullet (N.M or N.M.P pattern)
            if re.match(r'^\d+\.\d+(\s+|\.)', stripped):
                # Bullet item (numbered)
                if current_paragraph:
                    elements.append({'type': 'paragraph', 'content': '\n'.join(current_paragraph)})
                    current_paragraph = []
                current_bullet_list.append(stripped)
            else:
                # Regular text
                if current_bullet_list:
                    elements.append({'type': 'bullet_list', 'items': current_bullet_list})
                    current_bullet_list = []
                current_paragraph.append(line)
        
        # Handle remaining content
        if current_paragraph:
            elements.append({'type': 'paragraph', 'content': '\n'.join(current_paragraph)})
        if current_bullet_list:
            elements.append({'type': 'bullet_list', 'items': current_bullet_list})
        
        return elements

