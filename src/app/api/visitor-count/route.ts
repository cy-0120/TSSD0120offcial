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

// 방문자 수 증가 함수
const incrementVisitorCount = () => {
  const data = initializeVisitorCount()
  data.count += 1
  data.lastUpdated = new Date().toISOString()
  fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(data, null, 2))
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

// POST: 방문자 수 증가
export async function POST() {
  try {
    console.log('방문자 수 증가 요청 받음')
    const data = incrementVisitorCount()
    console.log('방문자 수 증가 완료:', data.count)
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

