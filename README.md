# 🎓 AI University System

> AI 기반 개인화 대학 교육 시스템 - 모든 연령대를 위한 맞춤형 AI 학습 플랫폼

[![GitHub License](https://img.shields.io/github/license/namseokyoo/AI-University-System)](https://github.com/namseokyoo/AI-University-System/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/namseokyoo/AI-University-System)](https://github.com/namseokyoo/AI-University-System/stargazers)
[![Phase](https://img.shields.io/badge/Phase-1.1_완료-brightgreen)](https://github.com/namseokyoo/AI-University-System)
[![Cost](https://img.shields.io/badge/비용-$0/월-blue)](https://github.com/namseokyoo/AI-University-System)

## ✨ 프로젝트 개요

AI University System은 AI를 활용하여 개인화된 대학 수준의 교육을 제공하는 혁신적인 학습 플랫폼입니다. 학생의 진도, 실력, 백그라운드, 성취도에 맞춰 커리큘럼과 교과과정을 자동으로 생성하고 최적화합니다.

### 🎯 주요 특징

- **🤖 AI 기반 개인화**: Deepseek API를 활용한 맞춤형 학습 경로
- **📚 동적 커리큘럼**: 실시간 진도 추적 및 커리큘럼 조정  
- **💰 비용 효율적**: 무료로 시작하여 선형적 확장 ($0-10/월)
- **🌐 확장 가능**: 초보자부터 전문가까지 모든 연령대 지원
- **📱 반응형 디자인**: 모든 디바이스에서 최적화된 학습 경험

## 🛠️ 기술 스택

### Backend
- **FastAPI** 0.115.14 - 고성능 Python 웹 프레임워크
- **Uvicorn** 0.35.0 - ASGI 서버
- **SQLAlchemy** 2.0.41 - Python ORM
- **Supabase** 2.8.1 - 실시간 데이터베이스
- **Pydantic** 2.11.7 - 데이터 검증

### Frontend  
- **Next.js** 14 - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **React** 18 - UI 라이브러리

### AI & APIs
- **Deepseek API** - AI 기반 컨텐츠 생성 및 개인화
- **YouTube Data API** - 교육 영상 통합
- **OpenAI GPT** (향후 지원) - 추가 AI 기능

### Database & Storage
- **Supabase PostgreSQL** - 메인 데이터베이스 (무료 500MB)
- **GitHub** - 정적 콘텐츠 저장소 (무료)
- **Cloudflare R2** - 미디어 파일 저장소 (무료 10GB)

## 🚀 현재 상태 (Phase 1.1 완료)

### ✅ 완료된 기능

- [x] **프로젝트 구조 설계** - 확장 가능한 아키텍처
- [x] **FastAPI 백엔드** - 완전한 API 서버 구조
- [x] **Next.js 프론트엔드** - 현대적인 React 애플리케이션
- [x] **Python 환경 설정** - 가상환경 + 82개 패키지
- [x] **API 엔드포인트** - 모든 기본 API 테스트 완료
- [x] **문서화** - Swagger UI 자동 생성
- [x] **CORS 설정** - 프론트엔드 연동 준비
- [x] **개발 환경** - 완전한 개발 도구 설정

### 🔧 테스트된 API 엔드포인트

| 엔드포인트 | 상태 | 설명 |
|------------|------|------|
| `GET /` | ✅ | 시스템 상태 확인 |
| `GET /api/v1/` | ✅ | API 정보 및 엔드포인트 목록 |
| `GET /api/v1/status` | ✅ | 서비스 상태 체크 |
| `GET /docs` | ✅ | Swagger UI 문서 |

## 🏗️ 프로젝트 구조

```
AI-University-System/
├── 📁 backend/                 # FastAPI 백엔드
│   ├── 📁 src/
│   │   ├── 📁 api/             # API 라우터
│   │   ├── 📁 core/            # 핵심 설정
│   │   ├── 📁 models/          # 데이터베이스 모델
│   │   ├── 📁 services/        # 비즈니스 로직
│   │   └── main.py             # FastAPI 애플리케이션
│   ├── requirements.txt        # Python 의존성
│   └── env.example            # 환경 변수 예시
├── 📁 frontend/               # Next.js 프론트엔드
│   ├── 📁 src/
│   │   ├── 📁 app/            # App Router 페이지
│   │   ├── 📁 components/     # React 컴포넌트
│   │   └── 📁 lib/           # 유틸리티 함수
│   ├── package.json          # Node.js 의존성
│   └── tailwind.config.js    # Tailwind 설정
├── 📁 content/               # 정적 교육 콘텐츠
├── 📁 docs/                  # 프로젝트 문서
└── 📁 scripts/              # 배포 및 유틸리티 스크립트
```

## ⚡ 빠른 시작

### 필수 조건
- Python 3.12+
- Node.js 18+
- Git

### 1. 저장소 클론
```bash
git clone https://github.com/namseokyoo/AI-University-System.git
cd AI-University-System
```

### 2. 백엔드 설정
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. 백엔드 실행
```bash
python -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. 프론트엔드 설정 (새 터미널)
```bash
cd frontend
npm install
npm run dev
```

### 5. 접속
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **프론트엔드**: http://localhost:3000

## 🛣️ 로드맵

### 📅 Phase 1.2 (진행 예정)
- [ ] Supabase 프로젝트 설정
- [ ] Deepseek API 연동
- [ ] YouTube Data API 연동
- [ ] 기본 데이터베이스 모델
- [ ] 환경 변수 설정

### 📅 Phase 2.0 (계획)
- [ ] 사용자 인증 시스템
- [ ] 코스 관리 시스템
- [ ] AI 기반 개인화 엔진
- [ ] 진도 추적 대시보드

### 📅 Phase 3.0 (향후)
- [ ] 실시간 채팅 기반 구두 평가
- [ ] 다중 AI 모델 지원
- [ ] 모바일 앱 개발
- [ ] 대학원 과정 확장

## 💰 비용 구조

| 단계 | 월 비용 | 포함 서비스 |
|------|---------|-------------|
| **Phase 1** | $0 | 개발 환경, 로컬 테스트 |
| **Phase 2** | $0-5 | Supabase (무료), Deepseek API |
| **Phase 3** | $5-15 | 확장된 API 사용량 |
| **Production** | $10-50 | 사용자 규모에 따라 선형 확장 |

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**Nam Seok Yoo** - [GitHub](https://github.com/namseokyoo)

## 📧 연락처

프로젝트 링크: [https://github.com/namseokyoo/AI-University-System](https://github.com/namseokyoo/AI-University-System)

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요! 