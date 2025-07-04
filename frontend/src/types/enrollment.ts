/**
 * 수강신청 관련 타입 정의
 */

import { Course } from './course';

export interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    progress_percentage: number;
    completed_lessons: string[];
    current_lesson_id?: string;
    total_study_time_minutes: number;
    is_completed: boolean;
    completed_at?: string;
    rating?: number;
    review?: string;
    created_at: string;
    updated_at: string;
}

export interface EnrollmentWithCourse extends Enrollment {
    course: {
        id: string;
        title: string;
        slug: string;
        short_description?: string;
        thumbnail_url?: string;
        difficulty_level: string;
        estimated_duration_hours?: number;
        rating: number;
        is_free: boolean;
        price: number;
    };
}

export interface EnrollmentRequest {
    course_id: string;
}

export interface ProgressUpdateRequest {
    lesson_id: string;
    study_time_minutes?: number;
}

export interface ReviewRequest {
    rating: number; // 1-5
    review?: string;
}

export interface EnrollmentStats {
    total_enrollments: number;
    completed_courses: number;
    in_progress_courses: number;
    total_study_hours: number;
    average_progress: number;
} 