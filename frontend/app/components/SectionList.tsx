'use client'

interface Section {
  number: number
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  content?: string
}

interface SectionListProps {
  sections: Section[]
  currentSection: number
  progress: number
  isComplete: boolean
  onDownload: () => void
}

export default function SectionList({
  sections,
  currentSection,
  progress,
  isComplete,
  onDownload,
}: SectionListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50'
      case 'in_progress':
        return '#2196f3'
      default:
        return '#ccc'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in_progress':
        return '→'
      default:
        return '○'
    }
  }

  return (
    <div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#1a1a1a'
      }}>
        Document Sections
      </h2>

      {/* Progress Bar */}
      <div style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '12px',
          color: '#666'
        }}>
          <span>Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Section List */}
      <div style={{ marginBottom: '20px' }}>
        {sections.map((section) => (
          <div
            key={section.number}
            style={{
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: `1px solid ${getStatusColor(section.status)}`,
              backgroundColor: section.number === currentSection ? '#f0f7ff' : '#fff',
              cursor: 'default'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px'
            }}>
              <span style={{
                fontSize: '18px',
                color: getStatusColor(section.status),
                fontWeight: 'bold'
              }}>
                {getStatusIcon(section.status)}
              </span>
              <span style={{
                fontSize: '12px',
                color: '#666',
                fontWeight: '600'
              }}>
                Section {section.number}
              </span>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#333',
              fontWeight: section.number === currentSection ? '600' : '400'
            }}>
              {section.title}
            </div>
          </div>
        ))}
      </div>

      {/* Download Button */}
      {isComplete && (
        <button
          onClick={onDownload}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4caf50'}
        >
          Download Final Document
        </button>
      )}
    </div>
  )
}

