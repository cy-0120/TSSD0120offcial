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
        const incrementResponse = await fetch(`${API_URL}/api/visitor-count`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!incrementResponse.ok) {
          throw new Error(`방문자 수 증가 실패: ${incrementResponse.status}`)
        }

        const incrementData = await incrementResponse.json()
        console.log('방문자 수 증가 응답:', incrementData)

        // 그 다음 현재 방문자 수 조회
        const response = await fetch(`${API_URL}/api/visitor-count`)
        
        if (!response.ok) {
          throw new Error(`방문자 수 조회 실패: ${response.status}`)
        }

        const data = await response.json()
        console.log('방문자 수 조회 응답:', data)

        if (data.success) {
          setVisitorCount(data.count)
        } else {
          console.error('방문자 수 조회 실패:', data.error)
          setVisitorCount(0)
        }
      } catch (error) {
        console.error('방문자 수 조회 오류:', error)
        console.error('API_URL:', API_URL)
        // 에러가 발생해도 0으로 표시
        setVisitorCount(0)
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

