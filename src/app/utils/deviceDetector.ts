/**
 * 디바이스 타입 감지 유틸리티
 */

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // 터치 스크린 감지
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // 화면 크기 감지 (768px 이하를 모바일로 간주)
  const isSmallScreen = window.innerWidth <= 768
  
  // User Agent 감지
  const userAgent = navigator.userAgent || navigator.vendor
  const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
  
  return hasTouchScreen && (isSmallScreen || isMobileUA)
}

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const width = window.innerWidth
  return width > 768 && width <= 1024
}

export const isDesktop = (): boolean => {
  if (typeof window === 'undefined') return false
  
  return window.innerWidth > 1024
}

