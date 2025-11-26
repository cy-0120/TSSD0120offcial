'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'

const API_URL = '/api/visitor-count'

export default function VisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 로드 시 방문자 수 자동 증가
  useEffect(() => {
    let isMounted = true
    
    const incrementAndFetch = async () => {
      try {
        console.log('[클라이언트] 방문자 수 증가 요청 시작')
        
        // 방문자 수 자동 증가
        const incrementResponse = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        console.log('[클라이언트] 응답 상태:', incrementResponse.status)

        if (incrementResponse.ok) {
          const incrementData = await incrementResponse.json()
          console.log('[클라이언트] 응답 데이터:', incrementData)
          
          if (incrementData.success) {
            if (isMounted) {
              setVisitorCount(incrementData.count)
              console.log('[클라이언트] 방문자 수 증가 성공:', incrementData.count)
            }
          } else {
            console.error('[클라이언트] 방문자 수 증가 실패:', incrementData.error)
            // 증가 실패 시 조회만 시도
            const response = await fetch(API_URL)
            if (response.ok) {
              const data = await response.json()
              if (data.success && isMounted) {
                setVisitorCount(data.count)
              } else if (isMounted) {
                setVisitorCount(0)
              }
            } else if (isMounted) {
              setVisitorCount(0)
            }
          }
        } else {
          const errorText = await incrementResponse.text()
          console.error('[클라이언트] 방문자 수 증가 HTTP 오류:', incrementResponse.status, errorText)
          // 증가 실패 시 조회만 시도
          const response = await fetch(API_URL)
          if (response.ok) {
            const data = await response.json()
            if (data.success && isMounted) {
              setVisitorCount(data.count)
            } else if (isMounted) {
              setVisitorCount(0)
            }
          } else if (isMounted) {
            setVisitorCount(0)
          }
        }
      } catch (error: any) {
        console.error('[클라이언트] 방문자 수 증가 오류:', error.message)
        // 오류 발생 시 조회만 시도
        try {
          const response = await fetch(API_URL)
          if (response.ok) {
            const data = await response.json()
            if (data.success && isMounted) {
              setVisitorCount(data.count)
            } else if (isMounted) {
              setVisitorCount(0)
            }
          } else if (isMounted) {
            setVisitorCount(0)
          }
        } catch (fetchError) {
          console.error('[클라이언트] 방문자 수 조회 오류:', fetchError)
          if (isMounted) {
            setVisitorCount(0)
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    incrementAndFetch()
    
    return () => {
      isMounted = false
    }
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

