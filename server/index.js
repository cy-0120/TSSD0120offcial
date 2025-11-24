const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 방문자 수 파일 경로
const VISITOR_COUNT_FILE = path.join(__dirname, 'visitor-count.json');

// 방문자 수 초기화 함수
const initializeVisitorCount = () => {
  if (!fs.existsSync(VISITOR_COUNT_FILE)) {
    const initialData = {
      count: 0,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const data = fs.readFileSync(VISITOR_COUNT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('방문자 수 파일 읽기 오류:', error);
    const initialData = {
      count: 0,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
};

// 방문자 수 증가 함수 (누적 형식)
const incrementVisitorCount = () => {
  const data = initializeVisitorCount();
  data.count += 1; // 누적 증가
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(VISITOR_COUNT_FILE, JSON.stringify(data, null, 2));
  return data;
};

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: 'TSSD Server is running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API 라우트 예제
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime()
  });
});

app.post('/api/data', (req, res) => {
  const { data } = req.body;
  res.json({ 
    message: 'Data received successfully',
    receivedData: data
  });
});

// 방문자 수 조회 API (누적 형식)
app.get('/api/visitor-count', (req, res) => {
  try {
    const data = initializeVisitorCount();
    res.json({
      success: true,
      count: data.count, // 누적된 총 방문자 수
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('방문자 수 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '방문자 수를 조회할 수 없습니다.'
    });
  }
});

// 방문자 수 증가 API (누적 형식)
app.post('/api/visitor-count', (req, res) => {
  try {
    const data = incrementVisitorCount(); // 누적 증가
    res.json({
      success: true,
      count: data.count, // 누적된 총 방문자 수
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('방문자 수 증가 오류:', error);
    res.status(500).json({
      success: false,
      error: '방문자 수를 증가시킬 수 없습니다.'
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

