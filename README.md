# HIS-Link Frontend

한동대 개발자를 위한 올인원 커뮤니티 플랫폼 **HIS-Link**의 React 프론트엔드입니다.

커뮤니티 · User Testing Lab · 팀 모집 · 메인 대시보드를 하나의 웹 앱에서 제공합니다.

## Live Deployment

| 항목 | URL |
|------|-----|
| **서비스** | https://purpleworld.cloud |
| **API (백엔드)** | https://purpleworld.cloud/api |

## Tech Stack

- React 18
- React Router v6
- Recoil (인증 상태)
- Fetch 기반 API 클라이언트 (`src/services/httpClient.js`)

## Prerequisites

- Node.js 18+
- npm
- 로컬 개발 시 [HisLink_BE](../HisLink_BE) 백엔드 실행 (기본 `http://localhost:8080`)

## Quick Start (Local)

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env

# 3. 개발 서버 실행
npm start
```

브라우저에서 http://localhost:3000 을 엽니다.

## Environment Variables

`.env` 파일을 프로젝트 루트에 생성합니다. (`.env`는 Git에 올리지 않습니다.)

### 로컬 개발

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_SERVER_URL=http://localhost:8080
```

### 배포 (purpleworld.cloud)

```env
REACT_APP_API_URL=https://purpleworld.cloud/api
REACT_APP_SERVER_URL=https://purpleworld.cloud
```

| 변수 | 설명 |
|------|------|
| `REACT_APP_API_URL` | REST API 베이스 URL (`/api` 포함) |
| `REACT_APP_SERVER_URL` | OAuth 로그인 등 서버 직접 호출용 URL |

> `REACT_APP_*` 값을 변경한 뒤에는 개발 서버를 재시작해야 반영됩니다.

## Scripts

| 명령 | 설명 |
|------|------|
| `npm start` | 개발 서버 (포트 3000) |
| `npm run build` | 프로덕션 빌드 (`build/` 생성) |
| `npm test` | 테스트 실행 |

## Main Routes

| 경로 | 설명 |
|------|------|
| `/` | 메인 대시보드 |
| `/login` | Google OAuth 로그인 |
| `/auth/callback` | OAuth 콜백 (JWT 저장) |
| `/community` | 커뮤니티 게시판 |
| `/community/new` | 글 작성 |
| `/community/:postId` | 글 상세 |
| `/lab` | User Testing Lab |
| `/lab/new` | 프로젝트 등록 |
| `/lab/:projectId` | 프로젝트 상세 |
| `/recruitment` | 팀 모집 |
| `/recruitment/new` | 모집글 작성 |
| `/recruitment/:postId` | 모집글 상세 |

## Project Structure

```
src/
├── components/     # UI 컴포넌트 (home, community, lab, recruitment, auth)
├── pages/          # 라우트 페이지
├── services/       # API 호출 (httpClient, authService, dashboardService 등)
├── hooks/          # useAuth 등
├── constants/      # 카테고리·역할 상수
├── mocks/          # 대시보드 목 데이터 (API 실패 시 폴백)
├── layouts/        # MainLayout (헤더 내비)
├── styles/         # 페이지·컴포넌트 CSS
└── utils/          # 토큰, API 헬퍼
```

## Authentication

- Google OAuth 2.0 (한동 이메일 도메인만 허용: `@handong.ac.kr`, `@handong.edu`)
- 로그인 성공 시 access/refresh JWT를 `localStorage`에 저장
- API 요청 시 `Authorization: Bearer <accessToken>` 자동 첨부
- access token 만료 시 refresh token으로 자동 재발급

로그인 URL: `{REACT_APP_SERVER_URL}/oauth2/authorization/google`

## Docker (Optional)

```bash
docker build -t hislink-fe .
docker run -p 3000:3000 --env-file .env hislink-fe
```

## Related Docs

- 백엔드 API: [HisLink_BE/docs/design/API.md](../HisLink_BE/docs/design/API.md)
- Swagger (로컬): http://localhost:8080/swagger-ui/index.html

## Team

Kim Sangmin · Park Sijin · Jeon Seyeon · Kwak Seowon
