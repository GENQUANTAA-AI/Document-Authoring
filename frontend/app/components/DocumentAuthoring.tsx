'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import UploadSection from './UploadSection'
import AuthoringInterface from './AuthoringInterface'
import SectionList from './SectionList'
import DocumentPreview from './DocumentPreview'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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

export default function DocumentAuthoring() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setSessionStatus({
        session_id: response.data.session_id,
        total_sections: response.data.total_sections,
        current_section: 1,
        progress: 0,
        sections: response.data.sections,
        is_complete: false,
      })
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload template')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (brief: string) => {
    if (!sessionStatus) return
    
    setLoading(true)
    setError(null)
    
    // Mark current section as in progress
    const updatedSections = sessionStatus.sections.map(s =>
      s.number === sessionStatus.current_section
        ? { ...s, status: 'in_progress' as const, content: '' }
        : s
    )
    setSessionStatus({ ...sessionStatus, sections: updatedSections })
    
    try {
      // Use streaming endpoint
      const response = await fetch(`${API_BASE_URL}/api/generate-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionStatus.session_id,
          brief: brief,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate content')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulatedContent = ''

      if (!reader) {
        throw new Error('No response body')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'chunk') {
                accumulatedContent += data.chunk
                // Update preview in real-time
                const updatedSectionsWithContent = sessionStatus.sections.map(s =>
                  s.number === sessionStatus.current_section
                    ? { ...s, content: accumulatedContent, status: 'in_progress' as const }
                    : s
                )
                setSessionStatus({ ...sessionStatus, sections: updatedSectionsWithContent })
              } else if (data.type === 'complete') {
                // Final update with complete session
                setSessionStatus(data.session)
                setLoading(false)
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e)
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate content')
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!sessionStatus) return
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/download/${sessionStatus.session_id}`,
        {
          responseType: 'blob',
        }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'SOP_Document.docx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to download document')
    }
  }

  const refreshStatus = async () => {
    if (!sessionStatus) return
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/status/${sessionStatus.session_id}`
      )
      setSessionStatus(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to refresh status')
    }
  }

  // If no session, show upload interface
  if (!sessionStatus) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <UploadSection onUpload={handleUpload} loading={loading} error={error} />
      </div>
    )
  }

  const handleContentUpdate = async (sectionNumber: number, content: string) => {
    if (!sessionStatus) return
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/update-content`, {
        session_id: sessionStatus.session_id,
        section_number: sectionNumber,
        content: content
      })
      setSessionStatus(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update content')
    }
  }

  // Show authoring interface
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'row',
      overflow: 'hidden'
    }}>
      {/* Left Panel - Section List */}
      <div style={{
        width: '280px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        overflowY: 'auto',
        padding: '20px'
      }}>
        <SectionList 
          sections={sessionStatus.sections}
          currentSection={sessionStatus.current_section}
          progress={sessionStatus.progress}
          isComplete={sessionStatus.is_complete}
          onDownload={handleDownload}
        />
      </div>

      {/* Middle Panel - Authoring Interface */}
      <div style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0'
      }}>
        <AuthoringInterface
          sessionStatus={sessionStatus}
          onGenerate={handleGenerate}
          loading={loading}
          error={error}
        />
      </div>

      {/* Right Panel - Document Preview */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        overflow: 'hidden'
      }}>
        <DocumentPreview
          sessionId={sessionStatus.session_id}
          sections={sessionStatus.sections}
          onContentUpdate={handleContentUpdate}
        />
      </div>
    </div>
  )
}

