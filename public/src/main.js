// 개발자 도구 감지 및 리다이렉트 (완화된 버전)
(function() {
  const redirectToBlank = () => {
    window.location.href = 'about:blank'
  }

  // 개발자 도구 감지 방법 1: 윈도우 크기 차이 감지
  let devtools = { open: false }
  const threshold = 160
  let detectionCount = 0
  
  const checkDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold
    const heightThreshold = window.outerHeight - window.innerHeight > threshold
    
    if (widthThreshold || heightThreshold) {
      detectionCount++
      // 2번 연속 감지되면 리다이렉트 (빠른 감지 + 오탐 방지)
      if (detectionCount >= 2 && !devtools.open) {
        devtools.open = true
        redirectToBlank()
      }
    } else {
      devtools.open = false
      detectionCount = 0
    }
  }
  
  // 주기적으로 개발자 도구 감지 (100ms 간격)
  setInterval(checkDevTools, 100)

  // 개발자 도구 감지 방법 2: debugger 감지
  const detectDebugger = () => {
    const start = Date.now()
    debugger
    const end = Date.now()
    // debugger가 멈추면 시간 차이가 큼 (100ms 이상)
    if (end - start > 100) {
      redirectToBlank()
    }
  }
  
  // 1초마다 debugger 감지
  setInterval(detectDebugger, 1000)

  // console 감지 제거 (다른 스크립트와의 충돌 방지)
  // console.log, console.error, console.warn 감지는 제거

  // disable-devtool 라이브러리 로드 확인 및 설정
  const checkAndSetup = () => {
    if (typeof window !== 'undefined') {
      // DisableDevtool 전역 객체 확인
      if (window.DisableDevtool) {
        window.DisableDevtool({
          ondevtoolopen: redirectToBlank
        })
        return true
      }
      // disableDevtool 함수 확인
      if (typeof window.disableDevtool === 'function') {
        window.disableDevtool({
          ondevtoolopen: redirectToBlank
        })
        return true
      }
    }
    return false
  }

  // 즉시 시도
  if (!checkAndSetup()) {
    // 라이브러리가 아직 로드되지 않은 경우 재시도
    let attempts = 0
    const maxAttempts = 50
    const interval = setInterval(() => {
      attempts++
      if (checkAndSetup() || attempts >= maxAttempts) {
        clearInterval(interval)
      }
    }, 100)
  }
})()

