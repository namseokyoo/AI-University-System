-- Phase 3: 코스 관리 시스템 테이블 생성
-- 생성 일시: 2024-12-30
-- 목적: 코스, 모듈, 레슨, 수강신청 테이블 생성

-- 1. 코스 상태 ENUM 타입 생성
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE lesson_type AS ENUM ('text', 'video', 'interactive', 'quiz');

-- 2. courses 테이블 생성
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- 메타 정보
    thumbnail_url VARCHAR(500),
    banner_url VARCHAR(500),
    tags JSONB DEFAULT '[]',
    categories JSONB DEFAULT '[]',
    
    -- 코스 설정
    status course_status DEFAULT 'draft',
    difficulty_level difficulty_level DEFAULT 'beginner',
    estimated_duration_hours INTEGER,
    
    -- 요구사항
    prerequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    target_audience JSONB DEFAULT '[]',
    
    -- 강사 정보
    instructor_id UUID REFERENCES auth.users(id),
    
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
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    last_updated_at TIMESTAMP WITH TIME ZONE
);

-- 3. modules 테이블 생성
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    
    -- 연결 정보
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- 학습 정보
    estimated_duration_minutes INTEGER,
    learning_objectives JSONB DEFAULT '[]',
    
    -- 상태
    is_published BOOLEAN DEFAULT false,
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. lessons 테이블 생성
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 기본 정보
    title VARCHAR(200) NOT NULL,
    content TEXT,
    order_index INTEGER DEFAULT 0,
    
    -- 연결 정보
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    
    -- 콘텐츠 정보
    lesson_type lesson_type DEFAULT 'text',
    content_url VARCHAR(500),
    resources JSONB DEFAULT '[]',
    
    -- 학습 정보
    estimated_duration_minutes INTEGER,
    difficulty_points INTEGER DEFAULT 0,
    
    -- AI 생성 정보
    is_ai_generated BOOLEAN DEFAULT false,
    ai_generation_prompt TEXT,
    
    -- 상태
    is_published BOOLEAN DEFAULT false,
    is_free_preview BOOLEAN DEFAULT false,
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. enrollments 테이블 생성
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 연결 정보
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- 진도 정보
    progress_percentage DECIMAL(5,2) DEFAULT 0.0,
    completed_lessons JSONB DEFAULT '[]',
    current_lesson_id UUID,
    
    -- 학습 통계
    total_study_time_minutes INTEGER DEFAULT 0,
    quiz_scores JSONB DEFAULT '{}',
    
    -- 상태
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    certificate_issued_at TIMESTAMP WITH TIME ZONE,
    
    -- 평가
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 유니크 제약조건
    UNIQUE(user_id, course_id)
);

-- 6. 인덱스 생성
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_created_at ON courses(created_at);

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_progress ON enrollments(user_id, progress_percentage);

-- 7. RLS (Row Level Security) 정책 설정
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 코스: 발행된 코스는 모든 사용자가 조회 가능
CREATE POLICY "Published courses are viewable by everyone" ON courses
    FOR SELECT USING (status = 'published');

-- 코스: 강사는 자신의 코스만 수정 가능
CREATE POLICY "Instructors can update own courses" ON courses
    FOR UPDATE USING (auth.uid() = instructor_id);

-- 모듈/레슨: 발행된 코스의 콘텐츠는 조회 가능
CREATE POLICY "Published course content is viewable" ON modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = modules.course_id 
            AND courses.status = 'published'
        )
    );

CREATE POLICY "Published lesson content is viewable" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses 
            JOIN modules ON courses.id = modules.course_id
            WHERE modules.id = lessons.module_id 
            AND courses.status = 'published'
        )
    );

-- 수강신청: 사용자는 자신의 수강신청만 조회/수정 가능
CREATE POLICY "Users can view own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. 트리거 생성
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at 
    BEFORE UPDATE ON modules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
    BEFORE UPDATE ON lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at 
    BEFORE UPDATE ON enrollments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. 기본 데이터 삽입 (샘플 코스)
INSERT INTO courses (
    title, 
    slug, 
    description, 
    short_description,
    status,
    difficulty_level,
    estimated_duration_hours,
    is_free,
    learning_objectives,
    target_audience,
    tags,
    categories
) VALUES (
    'AI 기초부터 실전까지',
    'ai-fundamentals-to-practice',
    '인공지능의 기본 개념부터 실제 프로젝트까지 단계별로 학습하는 완전한 코스입니다.',
    'AI 초보자를 위한 완전한 학습 과정',
    'published',
    'beginner',
    40,
    true,
    '["AI 기본 개념 이해", "머신러닝 알고리즘 구현", "실전 프로젝트 완성"]',
    '["프로그래밍 초보자", "AI에 관심있는 학생", "개발자 전환 희망자"]',
    '["AI", "machine-learning", "python", "beginner"]',
    '["Computer Science", "Artificial Intelligence"]'
); 