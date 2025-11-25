import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 프로덕션 환경에서는 .next 폴더에 저장, 개발 환경에서는 server 폴더에 저장
const getVisitorCountFilePath = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction) {
    // 프로덕션: 프로젝트 루트에 저장
    return path.join(process.cwd(), 'visitor-count.json')
  }
  // 개발: server 폴더에 저장
  return path.join(process.cwd(), 'server', 'visitor-count.json')
}

const VISITOR_COUNT_FILE = getVisitorCountFilePath()

// 방문자 수 초기화 함수
const initializeVisitorCount = () => {
  try {
    // 디렉토리가 없으면 생성
    const dir = path.dirname(VISITOR_COUNT_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    if (!fs.existsSync(VISITOR_COUNT_FILE)) {
      const initialData = {
        count: 0,
        lastUpdated: new Date().toISOString()
      }
      fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2), 'utf8')
      console.log('방문자 수 파일 생성:', VISITOR_COUNT_FILE)
      return initialData
    }
    
    const data = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')
    const parsed = JSON.parse(data)
    console.log('방문자 수 파일 읽기 성공:', parsed.count)
    return parsed
  } catch (error: any) {
    console.error('방문자 수 파일 읽기 오류:', error.message)
    const initialData = {
      count: 0,
      lastUpdated: new Date().toISOString()
    }
    try {
      fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2), 'utf8')
    } catch (writeError: any) {
      console.error('방문자 수 파일 쓰기 오류:', writeError.message)
    }
    return initialData
  }
}

// 방문자 수 증가 함수 (실시간 증가 - 중복 방지 없음)
const incrementVisitorCount = () => {
  const data = initializeVisitorCount()
  
  // 매번 방문할 때마다 카운트 증가 (실시간)
  data.count += 1
  data.lastUpdated = new Date().toISOString()
  fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(data, null, 2))
  console.log('방문자 수 증가:', data.count)
  
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

// POST: 방문자 수 증가 (실시간 증가 - 중복 방지 없음)
export async function POST(request: NextRequest) {
  try {
    console.log('방문자 수 증가 요청 받음 (실시간 모드)')
    
    const data = incrementVisitorCount()
    
    return NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    })
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

