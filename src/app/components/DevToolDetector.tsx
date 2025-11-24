'use client'

import { useEffect } from 'react'

export default function DevToolDetector() {
  useEffect(() => {
    const script1 = document.createElement('script')
    script1.setAttribute('disable-devtool-auto', '')
    script1.setAttribute('ondevtoolopen', "window.location.href='about:blank';")
    script1.src = 'https://cdn.jsdelivr.net/npm/disable-devtool@latest'
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.type = 'module'
    script2.src = '/src/main.js'
    document.head.appendChild(script2)

    return () => {
      if (document.head.contains(script1)) {
        document.head.removeChild(script1)
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2)
      }
    }
  }, [])

  return null
}

