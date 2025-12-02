# TSSD Official Website

- Next.js와 Node.js로 구성된 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Node.js, Express
- **스타일링**: CSS Modules

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── main/              # Main 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 전역 스타일
├── server/                # Node.js Express 서버
│   └── index.js
├── src/                   # 기존 파일 (참고용)
├── next.config.js         # Next.js 설정
├── tsconfig.json          # TypeScript 설정
└── package.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

필요한 경우 `.env` 파일을 생성하여 환경 변수를 설정하세요.

### 3. 개발 서버 실행

#### Next.js 개발 서버 (포트 3000)
```bash
npm run dev
```

#### Node.js Express 서버 (포트 3001)
```bash
npm run server
```

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 주요 기능

- ✅ Next.js App Router 기반 라우팅
- ✅ TypeScript 지원
- ✅ Express 서버 (Node.js)
- ✅ CSS Modules 스타일링

## API 엔드포인트

### Express 서버
- `GET /` - 서버 상태 확인
- `GET /api/health` - 헬스 체크
- `POST /api/data` - 데이터 수신
- `GET /api/visitor-count` - 방문자 수 조회
- `POST /api/visitor-count` - 방문자 수 증가

## 개발 가이드

### 새 페이지 추가  
`app/` 디렉토리에 새 폴더를 만들고 `page.tsx` 파일을 생성하세요.


## 라이선스

MIT

# Rupital0815offcial
# Rupital0815offcial