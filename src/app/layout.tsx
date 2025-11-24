import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import DevToolDetector from './components/DevToolDetector'

export const metadata: Metadata = {
  title: 'TSSD Official Website',
  description: 'TSSD Official Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <DevToolDetector />
        {children}
      </body>
    </html>
  )
}

