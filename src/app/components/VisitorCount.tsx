'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'
import { 
  getVisitorCount, 
  incrementVisitorCount, 
  hasVisitedToday, 
  setTodayVisit 
} from '../utils/cookieUtils'

const API_URL = '/api/visitor-count'

export default function VisitorCount() {
  // 초기 상태에서 쿠키에서 개인 방문 횟수 가져오기
  const [totalVisitorCount, setTotalVisitorCount] = useState<number | null>(null)
  const [personalVisitCount, setPersonalVisitCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return getVisitorCount()
    }
    return 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const recordAndFetchVisitor = async () => {
      try {
        // 쿠키에서 개인 방문 횟수 가져오기
        let personalCount = getVisitorCount()
        setPersonalVisitCount(personalCount)
        
        // 오늘 방문했는지 확인
        const visitedToday = hasVisitedToday()
        console.log('방문자 수 컴포넌트 로드됨')
        console.log('오늘 방문 여부:', visitedToday, '개인 방문 횟수:', personalCount)
        
        // 오늘 방문하지 않았을 때만 서버에 카운트 증가 요청
        if (!visitedToday) {
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
              console.log('방문자 수 증가 응답:', incrementData)
              
              // 오늘 방문 표시 설정
              if (incrementData.isNewVisit) {
                setTodayVisit()
                // 개인 방문 횟수 증가
                personalCount = incrementVisitorCount()
                setPersonalVisitCount(personalCount)
              }
            } else {
              console.error('방문자 수 증가 실패:', incrementResponse.status)
            }
          } catch (incrementError) {
            console.error('방문자 수 증가 요청 오류:', incrementError)
          }
        } else {
          // 오늘 이미 방문한 경우에도 개인 방문 횟수 표시
          setPersonalVisitCount(personalCount)
        }

        // 현재 총 방문자 수 조회 (항상 실행)
        const response = await fetch(API_URL)
        
        if (response.ok) {
          const data = await response.json()
          console.log('방문자 수 조회 응답:', data)

          if (data.success) {
            setTotalVisitorCount(data.count)
          } else {
            console.error('방문자 수 조회 실패:', data.error)
            setTotalVisitorCount(0)
          }
        } else {
          console.error('방문자 수 조회 HTTP 오류:', response.status)
          setTotalVisitorCount(0)
        }
      } catch (error) {
        console.error('방문자 수 처리 오류:', error)
        setTotalVisitorCount(0)
        // 에러가 발생해도 개인 방문 횟수는 표시
        const personalCount = getVisitorCount()
        setPersonalVisitCount(personalCount)
      } finally {
        setIsLoading(false)
      }
    }

    recordAndFetchVisitor()
  }, [])

  return (
    <div className={styles.visitorCount}>
      {isLoading ? (
        <div className={styles.visitorInfo}>
          <div className={styles.totalCount}>
            <span className={styles.label}>로딩 중...</span>
          </div>
        </div>
      ) : (
        <div className={styles.visitorInfo}>
          <div className={styles.totalCount}>
            <span className={styles.label}>총 방문자:</span>
            <span className={styles.count}>{totalVisitorCount !== null ? totalVisitorCount.toLocaleString() : 0}</span>
          </div>
          <div className={styles.personalCount}>
            <span className={styles.label}>내 방문:</span>
            <span className={styles.count}>{personalVisitCount}</span>
          </div>
        </div>
      )}
    </div>
  )
}

