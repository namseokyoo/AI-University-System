# 🎨 AI University System - 디자인 시스템

> 프론트엔드 UI/UX 디자인 시스템 및 컴포넌트 가이드라인

## 📋 브랜치 정보

- **브랜치명**: `feature/ui-design-system`
- **작업 목적**: 프론트엔드 디자인 시스템 구축
- **병렬 작업**: 백그라운드 에이전트를 통한 독립적 디자인 작업
- **부모 브랜치**: `develop`

## 🎯 디자인 시스템 목표

### 1. **통일된 디자인 언어**
- 일관된 색상 팔레트
- 타이포그래피 시스템
- 공통 컴포넌트 라이브러리
- 반응형 디자인 패턴

### 2. **교육 플랫폼 특화 UI**
- 학습자 친화적 인터페이스
- 직관적인 네비게이션
- 접근성 준수 (WCAG 2.1 AA)
- 다크/라이트 테마 지원

### 3. **개발자 친화적 시스템**
- shadcn/ui 기반 컴포넌트
- Tailwind CSS 유틸리티 클래스
- TypeScript 타입 정의
- Storybook 문서화

## 🎨 색상 시스템

### Primary Colors (AI/교육 테마)
```css
:root {
  /* Primary - AI Blue */
  --primary: 220 70% 50%;
  --primary-foreground: 220 70% 98%;
  
  /* Secondary - Education Green */
  --secondary: 142 70% 45%;
  --secondary-foreground: 142 70% 98%;
  
  /* Accent - Learning Orange */
  --accent: 25 95% 60%;
  --accent-foreground: 25 95% 98%;
}
```

### Semantic Colors
```css
:root {
  /* Success - Completed */
  --success: 142 70% 45%;
  
  /* Warning - In Progress */
  --warning: 45 90% 60%;
  
  /* Error - Failed */
  --destructive: 0 84% 60%;
  
  /* Info - Information */
  --info: 200 85% 60%;
}
```

## 📏 타이포그래피

### 폰트 스택
```css
/* Primary Font - 한글/영문 혼용 */
font-family: 'Pretendard Variable', 'Inter', system-ui, sans-serif;

/* Code Font */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### 텍스트 크기 시스템
```css
/* Heading Scale */
.text-4xl  /* 36px - Main Page Title */
.text-3xl  /* 30px - Section Title */
.text-2xl  /* 24px - Card Title */
.text-xl   /* 20px - Subsection */
.text-lg   /* 18px - Large Text */
.text-base /* 16px - Body Text */
.text-sm   /* 14px - Secondary Text */
.text-xs   /* 12px - Caption */
```

## 🧩 컴포넌트 라이브러리

### 기본 컴포넌트
```
frontend/src/components/
├── ui/                     # shadcn/ui 기반 기본 컴포넌트
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   └── ...
├── layout/                 # 레이아웃 컴포넌트
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── footer.tsx
│   └── dashboard-layout.tsx
├── education/              # 교육 특화 컴포넌트
│   ├── course-card.tsx
│   ├── lesson-player.tsx
│   ├── progress-bar.tsx
│   ├── quiz-component.tsx
│   └── achievement-badge.tsx
└── auth/                   # 인증 관련 컴포넌트
    ├── login-form.tsx
    ├── signup-form.tsx
    └── profile-card.tsx
```

### 교육 플랫폼 특화 컴포넌트

#### 1. **CourseCard**
```typescript
interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  thumbnail?: string;
  tags: string[];
}
```

#### 2. **ProgressBar**
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning';
}
```

#### 3. **LessonPlayer**
```typescript
interface LessonPlayerProps {
  type: 'video' | 'text' | 'interactive';
  content: LessonContent;
  onComplete: () => void;
  onProgress: (progress: number) => void;
}
```

## 📱 반응형 디자인

### 브레이크포인트
```css
/* Mobile First Approach */
sm: '640px'   /* 태블릿 */
md: '768px'   /* 작은 데스크톱 */
lg: '1024px'  /* 데스크톱 */
xl: '1280px'  /* 큰 데스크톱 */
2xl: '1536px' /* 와이드 스크린 */
```

### 레이아웃 패턴
1. **모바일**: 스택형 레이아웃
2. **태블릿**: 2열 그리드
3. **데스크톱**: 사이드바 + 메인 콘텐츠

## 🎭 테마 시스템

### 라이트 테마 (기본)
- 깔끔하고 밝은 학습 환경
- 높은 가독성
- 장시간 학습에 적합

### 다크 테마
- 눈의 피로 감소
- 야간 학습 모드
- 코딩 환경에 친화적

## ♿ 접근성 가이드라인

### WCAG 2.1 AA 준수
1. **색상 대비**: 최소 4.5:1 비율
2. **키보드 네비게이션**: 모든 요소 접근 가능
3. **스크린 리더**: 의미있는 alt 텍스트
4. **포커스 인디케이터**: 명확한 포커스 표시

### 교육 접근성
1. **다국어 지원**: 한국어/영어
2. **글자 크기 조절**: 사용자 설정
3. **동작 줄이기**: 애니메이션 제어
4. **고대비 모드**: 시각 장애 지원

## 🔧 개발 도구

### 1. **Tailwind CSS**
```bash
# 유틸리티 우선 스타일링
npm install tailwindcss postcss autoprefixer
```

### 2. **shadcn/ui**
```bash
# 고품질 컴포넌트 라이브러리
npx shadcn-ui@latest init
```

### 3. **Storybook**
```bash
# 컴포넌트 문서화 및 테스트
npx storybook@latest init
```

### 4. **Framer Motion**
```bash
# 애니메이션 라이브러리
npm install framer-motion
```

## 📚 디자인 작업 플로우

### 1. **컴포넌트 설계**
```
1. Figma 디자인 → 2. 컴포넌트 분석 → 3. TypeScript 인터페이스 정의
4. shadcn/ui 기반 구현 → 5. Storybook 문서화 → 6. 반응형 테스트
```

### 2. **브랜치 작업 순서**
```bash
# 1. 새로운 컴포넌트 작업 시
git checkout feature/ui-design-system
git pull origin feature/ui-design-system

# 2. 컴포넌트 개발
# 3. 테스트 및 문서화
# 4. 커밋 및 푸시
git add .
git commit -m "feat(ui): 새로운 컴포넌트 추가"
git push origin feature/ui-design-system
```

### 3. **다른 브랜치와의 통합**
- **독립적 작업**: 인증 시스템과 병렬 개발
- **주기적 동기화**: develop 브랜치와 정기 머지
- **컴포넌트 공유**: 완성된 컴포넌트는 즉시 다른 브랜치에서 활용

## 🎨 우선순위 작업 목록

### Phase 1: 기본 디자인 시스템 (1-2주)
- [ ] 색상 팔레트 정의
- [ ] 타이포그래피 시스템 구축
- [ ] 기본 UI 컴포넌트 (Button, Input, Card)
- [ ] 레이아웃 컴포넌트 (Header, Sidebar, Footer)

### Phase 2: 교육 특화 컴포넌트 (2-3주)
- [ ] CourseCard 컴포넌트
- [ ] ProgressBar 및 통계 컴포넌트
- [ ] LessonPlayer 인터페이스
- [ ] 퀴즈 및 평가 컴포넌트

### Phase 3: 고급 기능 (3-4주)
- [ ] 다크 테마 구현
- [ ] 애니메이션 시스템
- [ ] 접근성 최적화
- [ ] 성능 최적화

## 📊 백그라운드 에이전트 작업 가이드

### 자율적 작업 권한
- ✅ 컴포넌트 디자인 및 구현
- ✅ 스타일 시스템 개선
- ✅ 반응형 디자인 최적화
- ✅ 접근성 개선

### 주기적 동기화
- **매일**: 진행 상황 업데이트
- **주간**: develop 브랜치와 동기화
- **완료 시**: 컴포넌트별 PR 생성

### 의사소통
- **개발 로그**: 일일 작업 내용 기록
- **Storybook**: 컴포넌트 문서화
- **GitHub Issues**: 디자인 피드백 및 요청사항

---

## 🚀 시작하기

```bash
# 1. 디자인 브랜치로 이동
git checkout feature/ui-design-system

# 2. 프론트엔드 디렉토리로 이동
cd frontend

# 3. 필요한 패키지 설치 (필요시)
npm install

# 4. 개발 서버 실행
npm run dev

# 5. Storybook 실행 (컴포넌트 문서화)
npm run storybook
```

이제 백그라운드 에이전트가 독립적으로 디자인 시스템을 구축할 수 있는 완전한 가이드라인이 준비되었습니다! 🎨✨ 