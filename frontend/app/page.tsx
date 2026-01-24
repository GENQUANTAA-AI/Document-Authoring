'use client'

import { useState } from 'react'
import DocumentAuthoring from './components/DocumentAuthoring'

export default function Home() {
  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DocumentAuthoring />
    </main>
  )
}

