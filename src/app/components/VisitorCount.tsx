'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const recordAndFetchVisitor = async () => {
      try {
        // 먼저 방문자 수 증가
        await fetch(`${API_URL}/api/visitor-count`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        // 그 다음 현재 방문자 수 조회
        const response = await fetch(`${API_URL}/api/visitor-count`)
        const data = await response.json()

        if (data.success) {
          setVisitorCount(data.count)
        }
      } catch (error) {
        console.error('방문자 수 조회 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }

    recordAndFetchVisitor()
  }, [])

  if (isLoading) {
    return (
      <div className={styles.visitorCount}>
        <span className={styles.label}>방문자 수:</span>
        <span className={styles.count}>로딩 중...</span>
      </div>
    )
  }

  return (
    <div className={styles.visitorCount}>
      <span className={styles.label}>방문자 수:</span>
      <span className={styles.count}>{visitorCount?.toLocaleString() || 0}</span>
    </div>
  )
}

