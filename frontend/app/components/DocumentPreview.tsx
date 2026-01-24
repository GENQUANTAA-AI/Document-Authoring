'use client'

import { useState } from 'react'

interface Section {
  number: number
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  content?: string
}

interface DocumentPreviewProps {
  sessionId: string
  sections: Section[]
  onContentUpdate?: (sectionNumber: number, content: string) => void
}

export default function DocumentPreview({ sessionId, sections, onContentUpdate }: DocumentPreviewProps) {
  const [editingSection, setEditingSection] = useState<number | null>(null)
  const [editContent, setEditContent] = useState<string>('')

  const handleEdit = (sectionNumber: number, currentContent: string) => {
    setEditingSection(sectionNumber)
    setEditContent(currentContent)
  }

  const handleSave = async (sectionNumber: number) => {
    if (onContentUpdate) {
      onContentUpdate(sectionNumber, editContent)
    }
    setEditingSection(null)
    setEditContent('')
  }

  const handleCancel = () => {
    setEditingSection(null)
    setEditContent('')
  }

  const formatContent = (content: string) => {
    // Split by lines and format
    return content.split('\n').map((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) return <br key={idx} />
      
      // Check if it's a numbered item
      if (/^\d+\.\d+(\s|\.)/.test(trimmed)) {
        return (
          <div key={idx} style={{ marginLeft: '20px', marginBottom: '8px' }}>
            {trimmed}
          </div>
        )
      }
      
      return (
        <div key={idx} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
          {trimmed}
        </div>
      )
    })
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fafafa'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: '#1a1a1a'
        }}>
          Document Preview
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#666',
          margin: '4px 0 0 0'
        }}>
          Real-time document view
        </p>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '30px',
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        lineHeight: '1.8',
        color: '#333'
      }}>
        {sections.map((section) => {
          const displayContent = section.content || ''
          const isEditing = editingSection === section.number

          return (
            <div
              key={section.number}
              style={{
                marginBottom: '40px',
                paddingBottom: '30px',
                borderBottom: section.number < sections.length ? '1px solid #e0e0e0' : 'none'
              }}
            >
              {/* Section Header */}
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#1a1a1a',
                borderLeft: '4px solid #0066cc',
                paddingLeft: '12px'
              }}>
                {section.title}
              </h3>

              {/* Section Content */}
              {isEditing ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      lineHeight: '1.6'
                    }}
                  />
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleSave(section.number)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#4caf50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ccc',
                        color: '#333',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {displayContent ? (
                    <div style={{ position: 'relative' }}>
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {formatContent(displayContent)}
                      </div>
                      {section.status === 'completed' && (
                        <button
                          onClick={() => handleEdit(section.number, displayContent)}
                          style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            padding: '4px 8px',
                            backgroundColor: '#f0f0f0',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            opacity: 0.7
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      color: '#999',
                      fontStyle: 'italic',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px'
                    }}>
                      {section.status === 'in_progress' 
                        ? 'Generating content...' 
                        : 'Content pending'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

