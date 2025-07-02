/**
 * 코스 관련 타입 정의
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
    id: string;
    title: string;
    slug: string;
    description?: string;
    short_description?: string;
    status: CourseStatus;
    difficulty_level: DifficultyLevel;
    estimated_duration_hours?: number;
    learning_objectives: string[];
    target_audience: string[];
    tags: string[];
    categories: string[];
    instructor_id?: string;
    rating: number;
    enrolled_count: number;
    is_ai_generated: boolean;
    is_free: boolean;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface CourseSummary {
    id: string;
    title: string;
    slug: string;
    short_description?: string;
    thumbnail_url?: string;
    difficulty_level: DifficultyLevel;
    estimated_duration_hours?: number;
    rating: number;
    enrolled_count: number;
    is_free: boolean;
    price: number;
    tags: string[];
    created_at: string;
}

export interface CourseCreateRequest {
    title: string;
    description: string;
    difficulty_level: DifficultyLevel;
    estimated_duration_hours?: number;
    learning_objectives?: string[];
    target_audience?: string[];
    tags?: string[];
    categories?: string[];
}

export interface AICourseCreateRequest {
    topic: string;
    difficulty_level: DifficultyLevel;
    target_hours: number;
    additional_requirements?: string;
}

export interface CourseFilters {
    status?: CourseStatus;
    difficulty_level?: DifficultyLevel;
    search?: string;
    tags?: string[];
    categories?: string[];
}

export interface CourseListResponse {
    courses: CourseSummary[];
    total: number;
    has_more: boolean;
}

// 난이도별 라벨
export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
    expert: '전문가'
};

// 난이도별 색상
export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800'
};

// 상태별 라벨
export const STATUS_LABELS: Record<CourseStatus, string> = {
    draft: '초안',
    published: '발행됨',
    archived: '보관됨'
};

// 상태별 색상
export const STATUS_COLORS: Record<CourseStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800'
}; 