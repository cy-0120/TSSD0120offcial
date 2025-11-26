'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'
import { 
  getRecommendClickCount, 
  incrementRecommendClickCount, 
  canRecommend,
  resetRecommendClickCount,
  setCookie
} from '../utils/cookieUtils'

const API_URL = '/api/visitor-count'

export default function VisitorCount() {
  const [recommendCount, setRecommendCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClicking, setIsClicking] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  // 초기 로드 시 추천 수만 조회 (자동 증가 없음)
  useEffect(() => {
    const fetchRecommendCount = async () => {
      try {
        // 쿠키에서 클릭 횟수 가져오기
        const currentClickCount = getRecommendClickCount()
        setClickCount(currentClickCount)
        console.log('현재 클릭 횟수:', currentClickCount)

        // 현재 추천 수 조회 (GET만 사용, 자동 증가 없음)
        const response = await fetch(API_URL)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setRecommendCount(data.count)
            console.log('추천 수 조회 성공:', data.count)
          } else {
            console.error('추천 수 조회 실패:', data.error)
            setRecommendCount(0)
          }
        } else {
          console.error('추천 수 조회 HTTP 오류:', response.status)
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

  // 클릭 시 추천 수 증가 (계정당 최대 5번)
  const handleClick = async () => {
    if (isClicking) return // 중복 클릭 방지
    
    // 추천 가능 여부 확인
    if (!canRecommend()) {
      alert('추천은 계정당 최대 5번까지 가능합니다.')
      return
    }
    
    setIsClicking(true)
    
    // 클릭 횟수 증가 (누적) - 먼저 증가
    const currentClickCount = getRecommendClickCount()
    const newClickCount = incrementRecommendClickCount()
    setClickCount(newClickCount)
    console.log('클릭 횟수 증가:', currentClickCount, '→', newClickCount)
    
    // 즉시 UI 피드백 (낙관적 업데이트)
    const currentCount = recommendCount || 0
    const optimisticCount = currentCount + 1
    setRecommendCount(optimisticCount)
    console.log('낙관적 업데이트:', currentCount, '→', optimisticCount)
    
    try {
      console.log('추천 수 증가 요청 시작 (클릭 횟수:', newClickCount, '/5)')
      
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
          // 서버에서 받은 실제 카운트로 업데이트 (누적 확인)
          setRecommendCount(incrementData.count)
          console.log('추천 수 증가 성공 (누적):', currentCount, '→', incrementData.count)
        } else {
          // 실패 시 원래 값으로 복원
          setRecommendCount(currentCount)
          // 쿠키 복원: 이전 값으로 되돌리기
          if (currentClickCount > 0) {
            setCookie('recommendClickCount', currentClickCount.toString(), 90)
          } else {
            resetRecommendClickCount()
          }
          setClickCount(currentClickCount)
          console.error('추천 수 증가 실패:', incrementData.error)
        }
      } else {
        // HTTP 오류 시 원래 값으로 복원
        setRecommendCount(currentCount)
        // 쿠키 복원: 이전 값으로 되돌리기
        if (currentClickCount > 0) {
          setCookie('recommendClickCount', currentClickCount.toString(), 90)
        } else {
          resetRecommendClickCount()
        }
        setClickCount(currentClickCount)
        const errorText = await incrementResponse.text()
        console.error('추천 수 증가 HTTP 오류:', incrementResponse.status, errorText)
      }
    } catch (error: any) {
      // 네트워크 오류 시 원래 값으로 복원
      setRecommendCount(currentCount)
      // 쿠키 복원: 이전 값으로 되돌리기
      if (currentClickCount > 0) {
        setCookie('recommendClickCount', currentClickCount.toString(), 90)
      } else {
        resetRecommendClickCount()
      }
      setClickCount(currentClickCount)
      console.error('추천 수 증가 요청 오류:', error.message)
    } finally {
      // 클릭 애니메이션 효과
      setTimeout(() => setIsClicking(false), 300)
    }
  }

  return (
    <div className={styles.container}>
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
            {clickCount >= 5 && (
              <span className={styles.limitReached} title="추천은 계정당 최대 5번까지 가능합니다">
                (최대)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

