'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isMobile } from './utils/deviceDetector'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // 모바일이면 /mobile로, 아니면 /main으로 리다이렉트
    if (isMobile()) {
      router.replace('/mobile')
    } else {
      router.replace('/main')
    }
  }, [router])

  return null
}

