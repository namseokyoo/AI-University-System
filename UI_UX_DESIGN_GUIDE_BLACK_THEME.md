# 🖤 AI University System - Black Theme UI/UX Design Guide

> 현대적이고 세련된 블랙 테마 기반 교육 플랫폼 디자인 시스템

## 🎯 디자인 철학

### Core Concept: **"Elegant Simplicity in Dark"**
- **Black as Foundation**: 블랙을 기본으로 한 세련된 배경
- **Minimal Complexity**: 복잡함을 제거한 심플하고 직관적인 인터페이스  
- **Modern Aesthetics**: 현대적인 감각의 타이포그래피와 레이아웃
- **Focused Learning**: 학습에 집중할 수 있는 환경 조성

### 브랜드 정체성
- **Premium Education**: 고급스럽고 전문적인 교육 플랫폼
- **AI-Powered**: 최첨단 AI 기술의 시각적 표현
- **User-Centric**: 사용자 경험 최우선의 인터페이스
- **Global Standard**: 국제적 수준의 디자인 품질

## 🎨 Color Palette - Black Theme Edition

### Primary Colors
```css
:root[data-theme="dark"] {
  /* Base Colors */
  --bg-primary: #000000;           /* Pure Black - Main Background */
  --bg-secondary: #0a0a0a;         /* Rich Black - Secondary Background */
  --bg-tertiary: #1a1a1a;          /* Dark Gray - Card/Modal Background */
  --bg-elevated: #2a2a2a;          /* Elevated Black - Hover States */
  
  /* AI Accent Colors */
  --accent-primary: #00d4ff;       /* Cyan Blue - AI/Tech Theme */
  --accent-secondary: #ff6b00;     /* Electric Orange - Learning Progress */
  --accent-tertiary: #00ff88;      /* Mint Green - Success States */
  
  /* Text Colors */
  --text-primary: #ffffff;         /* Pure White - Main Text */
  --text-secondary: #b4b4b4;       /* Light Gray - Secondary Text */
  --text-tertiary: #6b6b6b;        /* Medium Gray - Placeholder Text */
  --text-muted: #404040;           /* Dark Gray - Disabled Text */
}
```

### Semantic Colors
```css
:root[data-theme="dark"] {
  /* Status Colors */
  --success: #00ff88;              /* Completion, Achievement */
  --warning: #ffaa00;              /* In Progress, Attention */
  --error: #ff4444;                /* Error, Failed */
  --info: #00d4ff;                 /* Information, New */
  
  /* Learning Status */
  --progress-bg: #1a1a1a;          /* Progress Bar Background */
  --progress-fill: #00d4ff;        /* Progress Bar Fill */
  --achievement: #ffd700;          /* Gold - Special Achievements */
}
```

### Border & Effects
```css
:root[data-theme="dark"] {
  /* Borders */
  --border-primary: #333333;       /* Subtle Borders */
  --border-secondary: #1a1a1a;     /* Lighter Borders */
  --border-accent: #00d4ff;        /* Highlighted Borders */
  
  /* Shadows & Glows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.8);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.4);
  --glow-primary: 0 0 20px rgba(0, 212, 255, 0.3);
  --glow-accent: 0 0 15px rgba(255, 107, 0, 0.2);
}
```

## 📚 Typography System

### Font Stack
```css
/* Primary Font - Modern & Clean */
font-family: 'Inter Variable', 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

/* Monospace - Code & Technical */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Display Font - Headlines */
font-family: 'Satoshi Variable', 'Inter Variable', system-ui, sans-serif;
```

### Text Hierarchy
```css
/* Display Text - Main Titles */
.text-display-lg   /* 48px/60px - Landing Hero */
.text-display-md   /* 36px/44px - Page Headlines */
.text-display-sm   /* 30px/38px - Section Titles */

/* Heading Text */
.text-heading-lg   /* 24px/32px - Card Titles */
.text-heading-md   /* 20px/28px - Component Headers */
.text-heading-sm   /* 18px/24px - Sub Headers */

/* Body Text */
.text-body-lg      /* 16px/24px - Main Content */
.text-body-md      /* 14px/20px - Secondary Content */
.text-body-sm      /* 12px/16px - Captions, Labels */

/* Utility Text */
.text-code         /* 14px/20px - Code, Technical */
.text-overline     /* 11px/16px - Overlines, Tags */
```

### Font Weights
```css
.font-light    /* 300 - Subtle Text */
.font-normal   /* 400 - Body Text */
.font-medium   /* 500 - Emphasis */
.font-semibold /* 600 - Headings */
.font-bold     /* 700 - Strong Emphasis */
```

## 🧩 Component System

### Button Components
```css
/* Primary Button - Main Actions */
.btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #000000;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-primary);
}

/* Secondary Button - Secondary Actions */
.btn-secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid #333333;
  font-weight: 500;
}
.btn-secondary:hover {
  background: #1a1a1a;
  border-color: #00d4ff;
}

/* Ghost Button - Subtle Actions */
.btn-ghost {
  background: transparent;
  color: #b4b4b4;
  border: none;
}
.btn-ghost:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}
```

### Card Components
```css
/* Main Card - Content Containers */
.card-primary {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}
.card-primary:hover {
  border-color: #00d4ff;
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Glass Card - Overlay Content */
.card-glass {
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Elevated Card - Important Content */
.card-elevated {
  background: #2a2a2a;
  border: 1px solid #404040;
  box-shadow: var(--shadow-md);
}
```

### Input Components
```css
/* Text Input */
.input-primary {
  background: #1a1a1a;
  border: 2px solid #333333;
  border-radius: 8px;
  color: #ffffff;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}
.input-primary:focus {
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  outline: none;
}
.input-primary::placeholder {
  color: #6b6b6b;
}

/* Search Input */
.input-search {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 24px;
  padding: 10px 20px 10px 44px;
  position: relative;
}
```

## 📱 Layout Principles

### Grid System
```css
/* 12-Column Grid */
.grid-12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
.grid-8  { display: grid; grid-template-columns: repeat(8, 1fr); gap: 20px; }
.grid-4  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

/* Responsive Columns */
.col-span-1  { grid-column: span 1; }
.col-span-2  { grid-column: span 2; }
.col-span-3  { grid-column: span 3; }
.col-span-4  { grid-column: span 4; }
.col-span-6  { grid-column: span 6; }
.col-span-8  { grid-column: span 8; }
.col-span-12 { grid-column: span 12; }
```

### Spacing System
```css
/* Consistent Spacing Scale */
--space-1: 4px;    /* Micro spacing */
--space-2: 8px;    /* Small spacing */
--space-3: 12px;   /* Medium spacing */
--space-4: 16px;   /* Default spacing */
--space-5: 20px;   /* Large spacing */
--space-6: 24px;   /* XL spacing */
--space-8: 32px;   /* XXL spacing */  
--space-10: 40px;  /* Section spacing */
--space-12: 48px;  /* Page spacing */
--space-16: 64px;  /* Hero spacing */
--space-20: 80px;  /* Layout spacing */
```

### Container Sizes
```css
/* Content Containers */
.container-sm  { max-width: 640px; }   /* Mobile content */
.container-md  { max-width: 768px; }   /* Tablet content */
.container-lg  { max-width: 1024px; }  /* Desktop content */
.container-xl  { max-width: 1280px; }  /* Wide desktop */
.container-2xl { max-width: 1536px; }  /* Ultra wide */

/* Full width with padding */
.container-fluid { 
  width: 100%; 
  padding-left: var(--space-6); 
  padding-right: var(--space-6); 
}
```

## 🎭 Page-Specific Design Patterns

### Landing Page
```css
/* Hero Section */
.hero-section {
  background: radial-gradient(ellipse at center, #1a1a1a 0%, #000000 70%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Hero Background Effect */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,...') /* Subtle pattern */;
  opacity: 0.03;
}

/* Feature Cards Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
  padding: var(--space-16) 0;
}
```

### Dashboard Layout
```css
/* Main Dashboard Container */
.dashboard-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 80px 1fr;
  height: 100vh;
  background: var(--bg-primary);
}

/* Sidebar */
.dashboard-sidebar {
  grid-column: 1;
  grid-row: 1 / -1;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-primary);
  padding: var(--space-6);
}

/* Header */
.dashboard-header {
  grid-column: 2;
  grid-row: 1;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  padding: 0 var(--space-8);
}

/* Main Content */
.dashboard-main {
  grid-column: 2;
  grid-row: 2;
  padding: var(--space-8);
  overflow-y: auto;
  background: var(--bg-primary);
}
```

### Course Page
```css
/* Course Header */
.course-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  padding: var(--space-12) 0;
  border-bottom: 1px solid var(--border-primary);
}

/* Lesson Content Area */
.lesson-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-8);
  padding: var(--space-8);
}

/* Video/Content Player */
.content-player {
  background: var(--bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16/9;
  position: relative;
}

/* Course Sidebar */
.course-sidebar {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: var(--space-6);
  height: fit-content;
  position: sticky;
  top: var(--space-8);
}
```

## 🎨 Interactive States & Animations

### Hover Effects
```css
/* Smooth Hover Transitions */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Glow Effects */
.hover-glow {
  transition: box-shadow 0.3s ease;
}
.hover-glow:hover {
  box-shadow: var(--glow-primary);
}

/* Scale Effects */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.02);
}
```

### Loading States
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 50%,
    #1a1a1a 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Pulse Animation */
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
```

### Focus States
```css
/* Accessible Focus Indicators */
.focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Custom Focus Ring */
.focus-ring {
  position: relative;
}
.focus-ring:focus::before {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid var(--accent-primary);
  border-radius: inherit;
  opacity: 0.5;
}
```

## 📐 Responsive Design Principles

### Breakpoint Strategy
```css
/* Mobile First Responsive Design */
/* Base: Mobile (320px+) */
/* sm: Tablet (640px+) */
/* md: Desktop (768px+) */
/* lg: Large Desktop (1024px+) */
/* xl: Extra Large (1280px+) */
/* 2xl: Ultra Wide (1536px+) */

/* Navigation Adaptation */
@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: 60px 1fr 60px;
  }
  
  .dashboard-sidebar {
    grid-column: 1;
    grid-row: 3;
    border-right: none;
    border-top: 1px solid var(--border-primary);
    padding: var(--space-3);
  }
}
```

### Typography Scaling
```css
/* Fluid Typography */
.text-display-lg {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.2;
}

.text-display-md {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  line-height: 1.3;
}

.text-body-lg {
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.6;
}
```

## ♿ Accessibility & Usability

### Color Contrast Requirements
```css
/* WCAG AAA Compliance */
/* Background: #000000 + Text: #ffffff = 21:1 ratio ✅ */
/* Background: #1a1a1a + Text: #ffffff = 15.3:1 ratio ✅ */
/* Background: #000000 + Accent: #00d4ff = 8.2:1 ratio ✅ */

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #ffffff;
    --bg-primary: #000000;
    --border-primary: #ffffff;
    --accent-primary: #ffffff;
  }
}
```

### Motion Preferences
```css
/* Respect User Motion Preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation
```css
/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--accent-primary);
  color: var(--bg-primary);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}
.skip-link:focus {
  top: 6px;
}

/* Focus Management */
.focus-trap {
  position: relative;
}
.focus-trap:focus-within {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

## 🚀 Implementation Checklist

### Phase 1: Foundation (Week 1)
- [ ] Color system implementation in CSS variables
- [ ] Typography scale and font loading
- [ ] Base component library (Button, Input, Card)
- [ ] Layout system (Grid, Container, Spacing)

### Phase 2: Core Components (Week 2)
- [ ] Navigation components (Header, Sidebar, Menu)
- [ ] Form components (Input, Select, Checkbox, Radio)
- [ ] Feedback components (Alert, Toast, Modal)
- [ ] Loading states and animations

### Phase 3: Education-Specific (Week 3)
- [ ] Course card components
- [ ] Progress indicators
- [ ] Content player interface
- [ ] Assessment components (Quiz, Test)

### Phase 4: Advanced Features (Week 4)
- [ ] Search and filter interfaces
- [ ] Data visualization components
- [ ] Interactive learning elements
- [ ] Mobile responsive optimization

### Phase 5: Polish & Testing (Week 5)
- [ ] Accessibility audit and fixes
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] User testing and iteration

---

## 🎯 Next Steps

이 가이드를 바탕으로 각 페이지별 상세 디자인을 요청해주시면:

1. **메인/랜딩 페이지** - 히어로 섹션, 기능 소개, CTA
2. **대시보드** - 학습 현황, 진행 중인 코스, 통계
3. **코스 목록** - 필터링, 카드 레이아웃, 검색
4. **코스 상세** - 커리큘럼, 강의 플레이어, 진도 관리
5. **학습 페이지** - 콘텐츠 뷰어, 상호작용 요소
6. **평가/퀴즈** - 문제 표시, 답안 입력, 결과 화면
7. **프로필/설정** - 사용자 정보, 학습 이력, 설정

각각에 대해 구체적인 레이아웃, 컴포넌트 배치, 상호작용 패턴을 제안해드리겠습니다! 🖤✨