'use client'

import React, { useState, useEffect } from 'react'
import styles from './VisitorCount.module.css'
import { 
  hasVisitedToday, 
  setTodayVisit 
} from '../utils/cookieUtils'

const API_URL = '/api/visitor-count'

export default function VisitorCount() {
  const [totalVisitorCount, setTotalVisitorCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const recordAndFetchVisitor = async () => {
      try {
        // 오늘 방문했는지 확인
        const visitedToday = hasVisitedToday()
        console.log('방문자 수 컴포넌트 로드됨')
        console.log('오늘 방문 여부:', visitedToday)
        
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
              }
            } else {
              console.error('방문자 수 증가 실패:', incrementResponse.status)
            }
          } catch (incrementError) {
            console.error('방문자 수 증가 요청 오류:', incrementError)
          }
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
          <span className={styles.label}>방문자 수:</span>
          <span className={styles.count}>로딩 중...</span>
        </div>
      ) : (
        <div className={styles.visitorInfo}>
          <span className={styles.label}>방문자 수:</span>
          <span className={styles.count}>{totalVisitorCount !== null ? totalVisitorCount.toLocaleString() : 0}</span>
        </div>
      )}
    </div>
  )
}

