import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SOP Document Authoring',
  description: 'AI-powered SOP document authoring for regulated industries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

