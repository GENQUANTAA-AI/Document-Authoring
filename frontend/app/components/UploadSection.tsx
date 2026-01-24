'use client'

import { useState, useRef } from 'react'

interface UploadSectionProps {
  onUpload: (file: File) => void
  loading: boolean
  error: string | null
}

export default function UploadSection({ onUpload, loading, error }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith('.docx')) {
        onUpload(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{
      maxWidth: '600px',
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '40px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#1a1a1a'
      }}>
        SOP Document Authoring
      </h1>
      <p style={{
        fontSize: '14px',
        color: '#666',
        marginBottom: '30px'
      }}>
        Upload a Word (.docx) SOP template to begin authoring
      </p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? '#0066cc' : '#ccc'}`,
          borderRadius: '8px',
          padding: '60px 40px',
          textAlign: 'center',
          backgroundColor: dragActive ? '#f0f7ff' : '#fafafa',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
        <p style={{
          fontSize: '16px',
          color: '#333',
          marginBottom: '10px'
        }}>
          Drag and drop your DOCX template here
        </p>
        <p style={{
          fontSize: '14px',
          color: '#666'
        }}>
          or click to browse
        </p>
      </div>

      {error && (
        <div style={{
          marginTop: '20px',
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

      {loading && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          Processing template...
        </div>
      )}
    </div>
  )
}

