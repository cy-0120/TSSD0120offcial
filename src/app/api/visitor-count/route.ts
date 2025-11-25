import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 메모리 기반 저장소 (서버리스 환경 대응)
let memoryStore: {
  count: number
  lastUpdated: string
} | null = null

// 파일 시스템 저장소 (개발 환경용)
const getVisitorCountFilePath = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  if (isProduction) {
    return path.join(process.cwd(), 'visitor-count.json')
  }
  return path.join(process.cwd(), 'server', 'visitor-count.json')
}

const VISITOR_COUNT_FILE = getVisitorCountFilePath()

// 방문자 수 초기화 함수 (파일 시스템 시도, 실패 시 메모리 사용)
const initializeVisitorCount = () => {
  // 먼저 메모리에 값이 있으면 반환
  if (memoryStore) {
    return memoryStore
  }

  // 파일 시스템 시도 (개발 환경 또는 파일 쓰기 가능한 경우)
  try {
    if (fs.existsSync(VISITOR_COUNT_FILE)) {
      const data = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')
      const parsed = JSON.parse(data)
      memoryStore = parsed // 메모리에 캐시
      console.log('파일에서 추천 수 읽기 성공:', parsed.count)
      return parsed
    }
  } catch (error: any) {
    // 파일 읽기 실패 시 메모리 사용 (서버리스 환경)
    console.log('파일 시스템 사용 불가, 메모리 저장소 사용:', error.message)
  }

  // 메모리 저장소 초기화
  if (!memoryStore) {
    memoryStore = {
      count: 0,
      lastUpdated: new Date().toISOString()
    }
  }

  return memoryStore
}

// 방문자 수 증가 함수 (실시간 증가 - 중복 방지 없음)
const incrementVisitorCount = () => {
  try {
    const data = initializeVisitorCount()
    
    // 매번 방문할 때마다 카운트 증가 (실시간)
    const oldCount = data.count
    data.count += 1
    data.lastUpdated = new Date().toISOString()
    
    // 메모리 저장소 업데이트
    memoryStore = data
    
    // 파일 쓰기 시도 (가능한 경우에만)
    try {
      // 디렉토리가 없으면 생성 시도
      const dir = path.dirname(VISITOR_COUNT_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(data, null, 2), 'utf8')
      console.log(`추천 수 증가 성공 (파일 저장): ${oldCount} → ${data.count}`)
    } catch (writeError: any) {
      // 파일 쓰기 실패해도 메모리에는 저장됨 (서버리스 환경)
      console.log(`추천 수 증가 성공 (메모리 저장): ${oldCount} → ${data.count} (파일 쓰기 실패: ${writeError.message})`)
    }
    
    return data
  } catch (error: any) {
    console.error('추천 수 증가 함수 오류:', error.message)
    throw error
  }
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
    console.log('추천 수 증가 요청 받음')
    console.log('파일 경로:', VISITOR_COUNT_FILE)
    
    const data = incrementVisitorCount()
    
    console.log('추천 수 증가 완료, 현재 카운트:', data.count)
    
    return NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    })
  } catch (error: any) {
    console.error('추천 수 증가 오류:', error.message)
    console.error('스택:', error.stack)
    
    return NextResponse.json(
      {
        success: false,
        error: '추천 수를 증가시킬 수 없습니다.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

