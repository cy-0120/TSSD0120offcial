'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'

const API_URL = '/api/visitor-count'

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로드 시 방문자 수 자동 증가
  useEffect(() => {
    const incrementAndFetch = async () => {
      try {
        // 방문자 수 자동 증가
        const incrementResponse = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (incrementResponse.ok) {
          const incrementData = await incrementResponse.json()
          if (incrementData.success) {
            setVisitorCount(incrementData.count)
            console.log('방문자 수 증가 성공:', incrementData.count)
          } else {
            console.error('방문자 수 증가 실패:', incrementData.error)
            // 증가 실패 시 조회만 시도
            const response = await fetch(API_URL)
            if (response.ok) {
              const data = await response.json()
              if (data.success) {
                setVisitorCount(data.count)
              } else {
                setVisitorCount(0)
              }
            } else {
              setVisitorCount(0)
            }
          }
        } else {
          console.error('방문자 수 증가 HTTP 오류:', incrementResponse.status)
          // 증가 실패 시 조회만 시도
          const response = await fetch(API_URL)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setVisitorCount(data.count)
            } else {
              setVisitorCount(0)
            }
          } else {
            setVisitorCount(0)
          }
        }
      } catch (error) {
        console.error('방문자 수 증가 오류:', error)
        // 오류 발생 시 조회만 시도
        try {
          const response = await fetch(API_URL)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              setVisitorCount(data.count)
            } else {
              setVisitorCount(0)
            }
          } else {
            setVisitorCount(0)
          }
        } catch (fetchError) {
          console.error('방문자 수 조회 오류:', fetchError)
          setVisitorCount(0)
        }
      } finally {
        setIsLoading(false)
      }
    }

    incrementAndFetch()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.visitorCount}>
        {isLoading ? (
          <div className={styles.visitorInfo}>
            <span className={styles.label}>방문자 수:</span>
            <span className={styles.count}>로딩 중...</span>
          </div>
        ) : (
          <div className={styles.visitorInfo}>
            <span className={styles.label}>방문자 수:</span>
            <span className={styles.count}>{visitorCount !== null ? visitorCount.toLocaleString() : 0}</span>
          </div>
        )}
      </div>
    </div>
  )
}

