import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
// import DevToolDetector from './components/DevToolDetector'

export const metadata: Metadata = {
  title: 'Rupital0815 Official Website',
  description: 'Rupital0815 Official Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body>
        {/* <DevToolDetector /> */}
        {children}
      </body>
    </html>
  )
}

