'use client'

import { useState } from 'react'

interface Section {
  number: number
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  content?: string
}

interface SessionStatus {
  session_id: string
  total_sections: number
  current_section: number
  progress: number
  sections: Section[]
  is_complete: boolean
}

interface AuthoringInterfaceProps {
  sessionStatus: SessionStatus
  onGenerate: (brief: string) => void
  loading: boolean
  error: string | null
}

export default function AuthoringInterface({
  sessionStatus,
  onGenerate,
  loading,
  error,
}: AuthoringInterfaceProps) {
  const [brief, setBrief] = useState('')

  const currentSection = sessionStatus.sections.find(
    s => s.number === sessionStatus.current_section
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (brief.trim() && !loading && !sessionStatus.is_complete) {
      onGenerate(brief.trim())
      setBrief('') // Clear input after submission
    }
  }

  if (sessionStatus.is_complete) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>✓</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#1a1a1a'
          }}>
            Document Complete
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '30px'
          }}>
            All sections have been authored. Download the final document from the left panel.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '8px'
        }}>
          Section {sessionStatus.current_section} of {sessionStatus.total_sections}
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#1a1a1a',
          marginBottom: '10px'
        }}>
          {currentSection?.title || 'No section'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#666'
        }}>
          Provide a brief description of what this section should contain. The AI will generate professional SOP content based on your input.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '20px', flex: 1 }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333'
          }}>
            Section Brief
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="e.g., Describe the purpose of this SOP, outline the procedure steps, list responsibilities..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              flex: 1
            }}
            disabled={loading || sessionStatus.is_complete}
          />
        </div>

        {error && (
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
            color: '#c00',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!brief.trim() || loading || sessionStatus.is_complete}
          style={{
            padding: '14px 28px',
            backgroundColor: brief.trim() && !loading ? '#0066cc' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: brief.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
            alignSelf: 'flex-start'
          }}
          onMouseOver={(e) => {
            if (brief.trim() && !loading) {
              e.currentTarget.style.backgroundColor = '#0052a3'
            }
          }}
          onMouseOut={(e) => {
            if (brief.trim() && !loading) {
              e.currentTarget.style.backgroundColor = '#0066cc'
            }
          }}
        >
          {loading ? 'Generating...' : 'Generate & Next'}
        </button>
      </form>

      {/* Previous Section Preview (if completed) */}
      {currentSection && currentSection.number > 1 && (
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#666'
          }}>
            Previous Section Preview
          </h3>
          {(() => {
            const prevSection = sessionStatus.sections.find(
              s => s.number === currentSection.number - 1 && s.status === 'completed'
            )
            if (prevSection?.content) {
              return (
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.6',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {prevSection.content.substring(0, 300)}
                  {prevSection.content.length > 300 ? '...' : ''}
                </div>
              )
            }
            return null
          })()}
        </div>
      )}
    </div>
  )
}

