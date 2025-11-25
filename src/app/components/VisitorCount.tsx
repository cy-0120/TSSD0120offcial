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
    
    try {
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
          setRecommendCount(incrementData.count)
          // 클릭 애니메이션 효과
          setTimeout(() => setIsClicking(false), 300)
        } else {
          setIsClicking(false)
        }
      } else {
        setIsClicking(false)
      }
    } catch (error) {
      console.error('추천 수 증가 오류:', error)
      setIsClicking(false)
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

