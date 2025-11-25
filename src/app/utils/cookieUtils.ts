/**
 * 쿠키 유틸리티 함수
 * 참고: https://every-time-i-pass-this-place.tistory.com/entry/javascript-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%A9%EB%AC%B8%EC%9E%90%EC%88%98-%EC%BD%94%EB%93%9C
 */

/**
 * 쿠키 값 가져오기
 * @param cookieName 쿠키 이름
 * @returns 쿠키 값 (없으면 null)
 */
export const getCookie = (cookieName: string): string | null => {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split('; ')
  for (let i = 0; i < cookies.length; i++) {
    const [name, value] = cookies[i].split('=')
    if (name === cookieName) {
      return decodeURIComponent(value)
    }
  }
  return null
}

/**
 * 쿠키 설정
 * @param cookieName 쿠키 이름
 * @param cookieValue 쿠키 값
 * @param days 유효 기간 (일)
 */
export const setCookie = (cookieName: string, cookieValue: string, days: number = 90): void => {
  if (typeof document === 'undefined') return
  
  const expireDate = new Date()
  expireDate.setTime(expireDate.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${expireDate.toUTCString()}`
  document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)};${expires};path=/`
}

/**
 * 쿠키 삭제
 * @param cookieName 쿠키 이름
 */
export const deleteCookie = (cookieName: string): void => {
  if (typeof document === 'undefined') return
  document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

/**
 * 방문자 쿠키 확인 및 설정
 * @returns 개인 방문 횟수
 */
export const getVisitorCount = (): number => {
  const visitCount = getCookie('pageHit')
  if (visitCount) {
    return parseInt(visitCount, 10) || 0
  }
  return 0
}

/**
 * 방문자 수 증가 (쿠키 기반)
 * @returns 증가된 방문 횟수
 */
export const incrementVisitorCount = (): number => {
  let visitCount = getVisitorCount()
  visitCount++
  setCookie('pageHit', visitCount.toString(), 90) // 90일 유효
  return visitCount
}

/**
 * 오늘 방문했는지 확인 (중복 방지용)
 * @returns 오늘 방문했으면 true
 */
export const hasVisitedToday = (): boolean => {
  const lastVisit = getCookie('lastVisitDate')
  if (!lastVisit) return false
  
  const today = new Date().toDateString()
  return lastVisit === today
}

/**
 * 오늘 방문 표시 설정
 */
export const setTodayVisit = (): void => {
  const today = new Date().toDateString()
  setCookie('lastVisitDate', today, 1) // 1일 유효
}

/**
 * 추천 클릭 횟수 가져오기
 * @returns 추천 클릭 횟수 (최대 5)
 */
export const getRecommendClickCount = (): number => {
  const clickCount = getCookie('recommendClickCount')
  if (clickCount) {
    return parseInt(clickCount, 10) || 0
  }
  return 0
}

/**
 * 추천 클릭 횟수 증가
 * @returns 증가된 클릭 횟수
 */
export const incrementRecommendClickCount = (): number => {
  let clickCount = getRecommendClickCount()
  clickCount++
  setCookie('recommendClickCount', clickCount.toString(), 90) // 90일 유효
  return clickCount
}

/**
 * 추천 클릭 가능 여부 확인
 * @returns 5번 미만이면 true
 */
export const canRecommend = (): boolean => {
  return getRecommendClickCount() < 5
}

