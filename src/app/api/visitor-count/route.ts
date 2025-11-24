import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const VISITOR_COUNT_FILE = path.join(process.cwd(), 'server', 'visitor-count.json')

// 방문자 수 초기화 함수
const initializeVisitorCount = () => {
  if (!fs.existsSync(VISITOR_COUNT_FILE)) {
    const initialData = {
      count: 0,
      lastUpdated: new Date().toISOString()
    }
    fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
  try {
    const data = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('방문자 수 파일 읽기 오류:', error)
    const initialData = {
      count: 0,
      lastUpdated: new Date().toISOString()
    }
    fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2))
    return initialData
  }
}

// 방문자 수 증가 함수 (쿠키 기반 중복 방지)
const incrementVisitorCount = (hasVisitedToday: boolean) => {
  const data = initializeVisitorCount()
  
  // 오늘 방문하지 않았을 때만 카운트 증가 (중복 방지)
  if (!hasVisitedToday) {
    data.count += 1
    data.lastUpdated = new Date().toISOString()
    fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(data, null, 2))
    console.log('새 방문자 카운트 증가:', data.count)
  } else {
    console.log('오늘 이미 방문한 사용자 - 카운트 증가 안 함')
  }
  
  return data
}

// GET: 방문자 수 조회
export async function GET() {
  try {
    const data = initializeVisitorCount()
    return NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    })
  } catch (error: any) {
    console.error('방문자 수 조회 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '방문자 수를 조회할 수 없습니다.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// POST: 방문자 수 증가 (쿠키 기반 중복 방지)
export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 오늘 방문 여부 확인
    const lastVisitDate = request.cookies.get('lastVisitDate')?.value
    const today = new Date().toDateString()
    const hasVisitedToday = lastVisitDate === today
    
    console.log('방문자 수 증가 요청 받음, 오늘 방문 여부:', hasVisitedToday)
    
    const data = incrementVisitorCount(hasVisitedToday)
    
    // 응답에 쿠키 설정 (오늘 방문 표시)
    const response = NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated,
      isNewVisit: !hasVisitedToday
    })
    
    // 오늘 방문 쿠키 설정 (1일 유효)
    if (!hasVisitedToday) {
      response.cookies.set('lastVisitDate', today, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1일
        path: '/',
        sameSite: 'lax'
      })
    }
    
    return response
  } catch (error: any) {
    console.error('방문자 수 증가 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '방문자 수를 증가시킬 수 없습니다.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

