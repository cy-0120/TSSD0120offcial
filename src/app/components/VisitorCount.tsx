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
  const [totalVisitorCount, setTotalVisitorCount] = useState<number | null>(null)
  const [personalVisitCount, setPersonalVisitCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const recordAndFetchVisitor = async () => {
      try {
        // 쿠키에서 개인 방문 횟수 가져오기
        const personalCount = getVisitorCount()
        setPersonalVisitCount(personalCount)
        
        // 오늘 방문했는지 확인
        const visitedToday = hasVisitedToday()
        
        // 오늘 방문하지 않았을 때만 서버에 카운트 증가 요청
        if (!visitedToday) {
          const incrementResponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // 쿠키 포함
          })

          if (!incrementResponse.ok) {
            throw new Error(`방문자 수 증가 실패: ${incrementResponse.status}`)
          }

          const incrementData = await incrementResponse.json()
          console.log('방문자 수 증가 응답:', incrementData)
          
          // 오늘 방문 표시 설정
          if (incrementData.isNewVisit) {
            setTodayVisit()
            // 개인 방문 횟수 증가
            const newPersonalCount = incrementVisitorCount()
            setPersonalVisitCount(newPersonalCount)
          }
        }

        // 현재 총 방문자 수 조회
        const response = await fetch(API_URL)
        
        if (!response.ok) {
          throw new Error(`방문자 수 조회 실패: ${response.status}`)
        }

        const data = await response.json()
        console.log('방문자 수 조회 응답:', data)

        if (data.success) {
          setTotalVisitorCount(data.count)
        } else {
          console.error('방문자 수 조회 실패:', data.error)
          setTotalVisitorCount(0)
        }
      } catch (error) {
        console.error('방문자 수 조회 오류:', error)
        setTotalVisitorCount(0)
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
      <div className={styles.visitorInfo}>
        <div className={styles.totalCount}>
          <span className={styles.label}>총 방문자:</span>
          <span className={styles.count}>{totalVisitorCount?.toLocaleString() || 0}</span>
        </div>
        <div className={styles.personalCount}>
          <span className={styles.label}>내 방문:</span>
          <span className={styles.count}>{personalVisitCount}</span>
        </div>
      </div>
    </div>
  )
}

