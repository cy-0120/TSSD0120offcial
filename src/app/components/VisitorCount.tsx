'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'

const API_URL = '/api/visitor-count'

export default function VisitorCount() {
  const [recommendCount, setRecommendCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClicking, setIsClicking] = useState(false)

  // 초기 로드 시 추천 수만 조회 (자동 증가 없음)
  useEffect(() => {
    const fetchRecommendCount = async () => {
      try {
        const response = await fetch(API_URL)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setRecommendCount(data.count)
          } else {
            setRecommendCount(0)
          }
        } else {
          setRecommendCount(0)
        }
      } catch (error) {
        console.error('추천 수 조회 오류:', error)
        setRecommendCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendCount()
  }, [])

  // 클릭 시 추천 수 증가
  const handleClick = async () => {
    if (isClicking) return // 중복 클릭 방지
    
    setIsClicking(true)
    
    // 즉시 UI 피드백 (낙관적 업데이트)
    const currentCount = recommendCount || 0
    setRecommendCount(currentCount + 1)
    
    try {
      console.log('추천 수 증가 요청 시작')
      
      const incrementResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('추천 수 증가 응답 상태:', incrementResponse.status)

      if (incrementResponse.ok) {
        const incrementData = await incrementResponse.json()
        console.log('추천 수 증가 응답 데이터:', incrementData)
        
        if (incrementData.success) {
          // 서버에서 받은 실제 카운트로 업데이트
          setRecommendCount(incrementData.count)
          console.log('추천 수 증가 성공:', incrementData.count)
        } else {
          // 실패 시 원래 값으로 복원
          setRecommendCount(currentCount)
          console.error('추천 수 증가 실패:', incrementData.error)
        }
      } else {
        // HTTP 오류 시 원래 값으로 복원
        setRecommendCount(currentCount)
        const errorText = await incrementResponse.text()
        console.error('추천 수 증가 HTTP 오류:', incrementResponse.status, errorText)
      }
    } catch (error: any) {
      // 네트워크 오류 시 원래 값으로 복원
      setRecommendCount(currentCount)
      console.error('추천 수 증가 요청 오류:', error.message)
    } finally {
      // 클릭 애니메이션 효과
      setTimeout(() => setIsClicking(false), 300)
    }
  }

  return (
    <div 
      className={`${styles.visitorCount} ${isClicking ? styles.clicking : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label="추천하기"
    >
      {isLoading ? (
        <div className={styles.visitorInfo}>
          <span className={styles.label}>추천:</span>
          <span className={styles.count}>로딩 중...</span>
        </div>
      ) : (
        <div className={styles.visitorInfo}>
          <span className={styles.label}>추천:</span>
          <span className={styles.count}>{recommendCount !== null ? recommendCount.toLocaleString() : 0}</span>
        </div>
      )}
    </div>
  )
}

