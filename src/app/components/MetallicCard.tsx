'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import styles from './MetallicCard.module.css'

type MetallicCardProps = {
  enableGyro?: boolean
  interactionSignal?: number
}

export default function MetallicCard({ enableGyro = false, interactionSignal = 0 }: MetallicCardProps) {
  const [copied, setCopied] = useState(false)
  const [emailLink, setEmailLink] = useState('mailto:rupital0815@gmail.com')
  const [isMobile, setIsMobile] = useState(false)
  const [gyroActive, setGyroActive] = useState(false)
  const [parallaxActive, setParallaxActive] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const targetTilt = useRef({ x: 0, y: 0 })
  const animationFrame = useRef<number | null>(null)
  const cardWrapperRef = useRef<HTMLDivElement>(null)
  const tiltActive = gyroActive || parallaxActive

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

  const requestGyroPermission = useCallback(async () => {
    if (!enableGyro || !isMobile || gyroActive) return

    const orientationEvent = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied' | 'default'>
    }

    if (typeof orientationEvent.requestPermission === 'function') {
      try {
        const permission = await orientationEvent.requestPermission()
        if (permission === 'granted') {
          setGyroActive(true)
        }
      } catch {
        // 사용자가 거부하거나 지원하지 않는 환경
      }
      return
    }

    setGyroActive(true)
  }, [enableGyro, gyroActive, isMobile])

  useEffect(() => {
    if (interactionSignal > 0) {
      requestGyroPermission()
    }
  }, [interactionSignal, requestGyroPermission])

  useEffect(() => {
    if (enableGyro && !isMobile) {
      setParallaxActive(true)
    } else {
      setParallaxActive(false)
    }
  }, [enableGyro, isMobile])

  useEffect(() => {
    if (!gyroActive) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0
      const beta = event.beta ?? 0
      const maxTilt = 10

      targetTilt.current = {
        x: Math.max(-maxTilt, Math.min(maxTilt, gamma * 0.35)),
        y: Math.max(-maxTilt, Math.min(maxTilt, (beta - 45) * 0.2)),
      }
    }

    window.addEventListener('deviceorientation', handleOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true)
    }
  }, [gyroActive])

  useEffect(() => {
    if (!tiltActive) return

    const animateTilt = () => {
      setTilt((current) => ({
        x: current.x + (targetTilt.current.x - current.x) * 0.12,
        y: current.y + (targetTilt.current.y - current.y) * 0.12,
      }))
      animationFrame.current = requestAnimationFrame(animateTilt)
    }

    animationFrame.current = requestAnimationFrame(animateTilt)

    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [tiltActive])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!parallaxActive) return

    const rect = cardWrapperRef.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const maxTilt = 10

    targetTilt.current = {
      x: Math.max(-maxTilt, Math.min(maxTilt, ((event.clientX - centerX) / (rect.width / 2)) * maxTilt * 0.45)),
      y: Math.max(-maxTilt, Math.min(maxTilt, -((event.clientY - centerY) / (rect.height / 2)) * maxTilt * 0.45)),
    }
  }

  const handleMouseLeave = () => {
    if (!parallaxActive) return
    targetTilt.current = { x: 0, y: 0 }
  }

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


  const cardTransform = tiltActive
    ? `rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`
    : undefined

  return (
    <div
      ref={cardWrapperRef}
      className={styles.cardWrapper}
      onTouchStart={requestGyroPermission}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${styles.card3D} ${tiltActive ? styles.gyroActive : ''}`}
        style={cardTransform ? { transform: cardTransform } : undefined}
      >
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

