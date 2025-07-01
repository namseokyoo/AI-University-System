-- AI University System - Initial Database Schema
-- Created: 2024-07-01
-- Description: 초기 데이터베이스 스키마 생성

-- ============================================================================
-- 1. USERS TABLE - 사용자 정보
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    
    -- 프로필 정보
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    
    -- 연락처 정보
    phone VARCHAR(20),
    location VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- 계정 상태
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    
    -- 사용자 역할 및 권한
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    
    -- AI 학습 프로필
    current_skill_level VARCHAR(20) DEFAULT 'beginner' CHECK (current_skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    learning_goals JSONB,
    preferred_learning_style VARCHAR(50),
    
    -- 학습 통계
    total_study_hours INTEGER DEFAULT 0,
    courses_completed INTEGER DEFAULT 0,
    achievements JSONB,
    
    -- 개인화 설정
    language VARCHAR(10) DEFAULT 'ko',
    notification_preferences JSONB,
    ui_preferences JSONB,
    
    -- 소셜 연결
    github_username VARCHAR(100),
    linkedin_profile VARCHAR(200),
    
    -- 구독 정보
    subscription_started_at TIMESTAMP WITH TIME ZONE,
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- 마지막 활동
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    
    -- 기본 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. COURSES TABLE - 코스 정보
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- 메타 정보
    thumbnail_url VARCHAR(500),
    banner_url VARCHAR(500),
    tags JSONB,
    categories JSONB,
    
    -- 코스 설정
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_duration_hours INTEGER,
    
    -- 요구사항
    prerequisites JSONB,
    learning_objectives JSONB,
    target_audience JSONB,
    
    -- 강사 정보
    instructor_id UUID REFERENCES users(id),
    
    -- 평가 및 통계
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    enrolled_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    
    -- AI 생성 정보
    is_ai_generated BOOLEAN DEFAULT false,
    ai_generation_prompt TEXT,
    ai_model_used VARCHAR(100),
    
    -- 가격 정보
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10,2) DEFAULT 0.0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- 발행 정보
    published_at TIMESTAMP WITH TIME ZONE,
    last_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- 기본 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. MODULES TABLE - 코스 내 모듈/섹션
-- ============================================================================
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    
    -- 연결 정보
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- 학습 정보
    estimated_duration_minutes INTEGER,
    learning_objectives JSONB,
    
    -- 상태
    is_published BOOLEAN DEFAULT false,
    
    -- 기본 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. LESSONS TABLE - 모듈 내 개별 레슨
-- ============================================================================
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    
    -- 연결 정보
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    
    -- 콘텐츠 정보
    lesson_type VARCHAR(50) DEFAULT 'text' CHECK (lesson_type IN ('text', 'video', 'interactive', 'quiz')),
    content_url VARCHAR(500),
    resources JSONB,
    
    -- 학습 정보
    estimated_duration_minutes INTEGER,
    difficulty_points INTEGER DEFAULT 0,
    
    -- AI 생성 정보
    is_ai_generated BOOLEAN DEFAULT false,
    ai_generation_prompt TEXT,
    
    -- 상태
    is_published BOOLEAN DEFAULT false,
    is_free_preview BOOLEAN DEFAULT false,
    
    -- 기본 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. ENROLLMENTS TABLE - 수강 신청 및 진도 관리
-- ============================================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 연결 정보
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- 진도 정보
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    completed_lessons JSONB,
    current_lesson_id UUID,
    
    -- 학습 통계
    total_study_time_minutes INTEGER DEFAULT 0,
    quiz_scores JSONB,
    
    -- 상태
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    certificate_issued_at TIMESTAMP WITH TIME ZONE,
    
    -- 평가
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    -- 기본 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 중복 수강 방지
    UNIQUE(user_id, course_id)
);

-- ============================================================================
-- 6. INDEXES - 성능 최적화를 위한 인덱스
-- ============================================================================

-- Users 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Courses 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty_level ON courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON courses(is_free);

-- Modules 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON modules(course_id, order_index);

-- Lessons 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_type ON lessons(lesson_type);

-- Enrollments 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_progress ON enrollments(progress_percentage);
CREATE INDEX IF NOT EXISTS idx_enrollments_is_completed ON enrollments(is_completed);

-- ============================================================================
-- 7. FUNCTIONS & TRIGGERS - 자동 업데이트 및 유틸리티
-- ============================================================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 updated_at 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) - 보안 정책
-- ============================================================================

-- RLS 활성화 (필요시)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. SAMPLE DATA - 개발용 샘플 데이터 (선택적)
-- ============================================================================

-- 관리자 계정 생성 (개발용)
INSERT INTO users (
    email, username, hashed_password, first_name, last_name, 
    role, is_active, is_verified, current_skill_level
) VALUES (
    'admin@ai-university.com', 
    'admin', 
    '$2b$12$dummy.hash.for.development.only', 
    'System', 
    'Administrator',
    'admin', 
    true, 
    true, 
    'expert'
) ON CONFLICT (email) DO NOTHING;

-- 성공 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ AI University System 데이터베이스 스키마가 성공적으로 생성되었습니다!';
    RAISE NOTICE '📊 생성된 테이블: users, courses, modules, lessons, enrollments';
    RAISE NOTICE '🔗 인덱스, 트리거, 제약조건이 모두 설정되었습니다.';
END $$; 