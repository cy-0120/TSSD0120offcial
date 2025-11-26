import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 메모리 기반 저장소 (서버리스 환경 대응)
// 주의: 서버리스 환경에서는 각 인스턴스가 독립적이므로 메모리 저장소가 공유되지 않을 수 있습니다.
// 파일 시스템을 통한 동기화가 필요합니다.
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

// 방문자 수 초기화 함수 (항상 파일 우선, 메모리는 캐시로만 사용)
const initializeVisitorCount = () => {
  // 항상 파일에서 읽기 시도 (서버리스 환경에서도 지속성 보장)
  try {
    if (fs.existsSync(VISITOR_COUNT_FILE)) {
      const data = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')
      const parsed = JSON.parse(data)
      // 파일에서 읽은 값을 메모리에 캐시
      memoryStore = parsed
      console.log('파일에서 방문자 수 읽기 성공:', parsed.count)
      return parsed
    } else {
      // 파일이 없으면 초기값으로 생성 시도
      const initialData = {
        count: 0,
        lastUpdated: new Date().toISOString()
      }
      
      // 파일 생성 시도
      try {
        const dir = path.dirname(VISITOR_COUNT_FILE)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2), 'utf8')
        console.log('방문자 수 파일 생성 성공')
      } catch (writeError: any) {
        console.log('파일 생성 실패, 메모리만 사용:', writeError.message)
      }
      
      memoryStore = initialData
      return initialData
    }
  } catch (error: any) {
    // 파일 읽기 실패 시 메모리 사용 (임시)
    console.log('파일 읽기 실패, 메모리 저장소 사용:', error.message)
    
    // 메모리에 값이 있으면 사용
    if (memoryStore) {
      return memoryStore
    }
    
    // 메모리도 없으면 초기화
    memoryStore = {
      count: 0,
      lastUpdated: new Date().toISOString()
    }
    return memoryStore
  }
}

// 방문자 수 증가 함수 (항상 파일에 저장 시도)
const incrementVisitorCount = () => {
  try {
    // 항상 파일에서 최신 값 읽기 (메모리 캐시 무시)
    let data
    try {
      if (fs.existsSync(VISITOR_COUNT_FILE)) {
        const fileData = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')
        data = JSON.parse(fileData)
        console.log('파일에서 최신 방문자 수 읽기:', data.count)
      } else {
        // 파일이 없으면 초기화
        data = initializeVisitorCount()
      }
    } catch (readError: any) {
      // 파일 읽기 실패 시 메모리 또는 초기화
      data = memoryStore || initializeVisitorCount()
      console.log('파일 읽기 실패, 메모리 값 사용:', data.count)
    }
    
    // 방문자 수 증가
    const oldCount = data.count
    data.count += 1
    data.lastUpdated = new Date().toISOString()
    
    // 메모리 저장소 업데이트 (캐시)
    memoryStore = data
    
    // 항상 파일에 저장 시도 (지속성 보장)
    try {
      const dir = path.dirname(VISITOR_COUNT_FILE)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(data, null, 2), 'utf8')
      console.log(`방문자 수 증가 성공 (파일 저장): ${oldCount} → ${data.count}`)
    } catch (writeError: any) {
      // 파일 쓰기 실패 시 경고 (하지만 메모리에는 저장됨)
      console.warn(`방문자 수 증가 (메모리만 저장): ${oldCount} → ${data.count} (파일 쓰기 실패: ${writeError.message})`)
      // 서버리스 환경에서는 파일 쓰기가 실패할 수 있지만, 메모리에는 저장됨
    }
    
    return data
  } catch (error: any) {
    console.error('방문자 수 증가 함수 오류:', error.message)
    throw error
  }
}

// GET: 방문자 수 조회 (항상 파일에서 최신 값 읽기)
export async function GET() {
  try {
    // 항상 파일에서 읽기 시도 (메모리 캐시 무시하여 최신 값 보장)
    let data
    try {
      if (fs.existsSync(VISITOR_COUNT_FILE)) {
        const fileData = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8')
        data = JSON.parse(fileData)
        // 파일에서 읽은 값을 메모리에 캐시
        memoryStore = data
        console.log('파일에서 방문자 수 조회:', data.count)
      } else {
        // 파일이 없으면 초기화
        data = initializeVisitorCount()
      }
    } catch (readError: any) {
      // 파일 읽기 실패 시 메모리 또는 초기화
      console.log('파일 읽기 실패, 메모리 값 사용:', readError.message)
      data = memoryStore || initializeVisitorCount()
    }
    
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

// POST: 방문자 수 증가
export async function POST(request: NextRequest) {
  try {
    console.log('방문자 수 증가 요청 받음')
    console.log('파일 경로:', VISITOR_COUNT_FILE)
    
    const data = incrementVisitorCount()
    
    console.log('방문자 수 증가 완료, 현재 카운트:', data.count)
    
    return NextResponse.json({
      success: true,
      count: data.count,
      lastUpdated: data.lastUpdated
    })
  } catch (error: any) {
    console.error('방문자 수 증가 오류:', error.message)
    console.error('스택:', error.stack)
    
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

