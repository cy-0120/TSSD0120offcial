'use client'

import React, { useState, useEffect } from 'react'
import styles from './MetallicCard.module.css'

export default function MetallicCard() {
  const [copied, setCopied] = useState(false)
  const [emailLink, setEmailLink] = useState('mailto:rupital0815@gmail.com')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isMobileDevice = width <= 768 || isTouchDevice
      
      setIsMobile(isMobileDevice)
      
      const emailAddress = 'rupital0815@gmail.com'
      
      if (isMobileDevice) {
        // 모바일: mailto 사용
        setEmailLink('mailto:' + emailAddress)
      } else {
        // PC: 브라우저별 최적화
        const userAgent = navigator.userAgent.toLowerCase()
        
        if (userAgent.includes('edg')) {
          // Microsoft Edge - Outlook.com 연동
          setEmailLink(`https://outlook.live.com/owa/?path=/mail/action/compose&to=${emailAddress}`)
        } else if (userAgent.includes('firefox')) {
          // Firefox - Gmail 연동
          setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
        } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
          // Safari - OS별 최적화
          const isMacOS = userAgent.includes('mac')
          const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad')
          
          if (isMacOS || isIOS) {
            // macOS/iOS Safari - Mail.app 연동
            setEmailLink(`mailto:${emailAddress}`)
          } else {
            // Windows Safari - Gmail 연동
            setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
          }
        } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
          // Opera - Gmail 연동
          setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
        } else if (userAgent.includes('brave')) {
          // Brave Browser - Gmail 연동 (Chromium 기반)
          setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
        } else if (userAgent.includes('vivaldi')) {
          // Vivaldi - Gmail 연동
          setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
        } else if (userAgent.includes('whale')) {
          // 네이버 Whale - Gmail 연동
          setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
        } else if (userAgent.includes('chrome')) {
          // Chrome - Gmail 최적화
          setEmailLink(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`)
        } else if (userAgent.includes('trident') || userAgent.includes('msie')) {
          // Internet Explorer - Outlook 연동
          setEmailLink(`https://outlook.live.com/owa/?path=/mail/action/compose&to=${emailAddress}`)
        } else {
          // 기타 브라우저 - 기본 mailto
          setEmailLink(`mailto:${emailAddress}`)
        }
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('복사 실패:', err)
    }
  }


  return (
    <div className={styles.cardWrapper}>
      <div className={styles.card3D}>
        <div className={styles.cardFront}>
          <div className={styles.cardContent}>
            <div className={styles.logo}>Rupital0815</div>
            <div className={styles.title}>Student</div>
            <div className={styles.developmentText}>Development begins in 2024</div>
            <div className={styles.divider}></div>
            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>E-mail:</span>
                <a
                  href={emailLink}
                  className={styles.infoValue}
                  style={{ cursor: 'pointer', textDecoration: 'none' }}
                  target={!isMobile ? '_blank' : undefined}
                  rel={!isMobile ? 'noopener noreferrer' : undefined}
                >
                  rupital0815@gmail.com
                </a>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Discord:</span>
                <span 
                  className={styles.infoValue}
                  onClick={() => handleCopy('rupital0815')}
                  style={{ cursor: 'pointer' }}
                >
                  rupital0815
                </span>
                {copied && (
                  <span className={styles.copiedMessage}>copied(복사됨)</span>
                )}
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Major:</span>
                <span className={styles.infoValue}>Web & Security</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cardBack}></div>
      </div>
    </div>
  )
}

