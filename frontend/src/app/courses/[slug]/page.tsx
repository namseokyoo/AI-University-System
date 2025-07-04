'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/types/course';
import { Enrollment } from '@/types/enrollment';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { useAuth } from '@/contexts/AuthContext';
import {
    Clock,
    Users,
    Star,
    BookOpen,
    Target,
    Tag,
    Play,
    Download,
    Share2,
    Heart,
    ChevronLeft,
    Award,
    BarChart3,
    PlayCircle,
    FileText,
    CheckCircle2,
    Lock,
    Bookmark
} from 'lucide-react';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const slug = params?.slug as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // 코스 데이터 로드
    useEffect(() => {
        const loadCourseData = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                // 코스 정보 조회
                const courseData = await courseService.getCourseBySlug(slug);
                setCourse(courseData);

                // 수강신청 상태 확인
                if (user) {
                    try {
                        const enrollmentData = await enrollmentService.getEnrollment(courseData.id);
                        setEnrollment(enrollmentData);
                        setIsEnrolled(true);
                    } catch (e) {
                        setIsEnrolled(false);
                    }
                }

            } catch (error) {
                console.error('Failed to load course:', error);
                setError('코스 정보를 불러올 수 없습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadCourseData();
    }, [slug, user]);

    // 수강신청 처리
    const handleEnroll = async () => {
        if (!course || !user) return;

        try {
            setEnrolling(true);
            const enrollmentData = await enrollmentService.enrollCourse(course.id);
            setEnrollment(enrollmentData);
            setIsEnrolled(true);
        } catch (error) {
            console.error('Failed to enroll:', error);
            setError('수강신청에 실패했습니다.');
        } finally {
            setEnrolling(false);
        }
    };

    // 학습 시작
    const handleStartLearning = () => {
        if (!course) return;
        // TODO: 첫 번째 레슨으로 이동
        router.push(`/courses/${course.slug}/learn`);
    };

    // 북마크 토글
    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
        // TODO: 실제 북마크 API 호출
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
                        <div className="h-64 bg-gray-800 rounded mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                            </div>
                            <div>
                                <div className="h-48 bg-gray-800 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold mb-2">코스를 찾을 수 없습니다</h1>
                    <p className="text-gray-400 mb-6">{error || '요청한 코스가 존재하지 않습니다.'}</p>
                    <button
                        onClick={() => router.push('/courses')}
                        className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                    >
                        코스 목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    const difficultyColor = DIFFICULTY_COLORS[course.difficulty_level] || 'gray';
    const difficultyLabel = DIFFICULTY_LABELS[course.difficulty_level] || course.difficulty_level;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* 상단 네비게이션 */}
            <div className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>뒤로 가기</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 메인 콘텐츠 */}
                    <div className="lg:col-span-2">
                        {/* 코스 헤더 */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium bg-${difficultyColor}-900 text-${difficultyColor}-200`}
                                >
                                    {difficultyLabel}
                                </span>
                                {course.is_ai_generated && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-900 text-purple-200">
                                        AI 생성
                                    </span>
                                )}
                                {course.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="px-3 py-1 rounded-full text-sm bg-gray-800 text-gray-300"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                {course.title}
                            </h1>

                            {course.short_description && (
                                <p className="text-xl text-gray-300 mb-6">
                                    {course.short_description}
                                </p>
                            )}

                            {/* 코스 통계 */}
                            <div className="flex flex-wrap items-center gap-6 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span>{course.enrolled_count}명 수강</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span>{course.rating.toFixed(1)}</span>
                                </div>
                                {course.estimated_duration_hours && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span>{course.estimated_duration_hours}시간</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>{course.is_free ? '무료' : `₩${course.price.toLocaleString()}`}</span>
                                </div>
                            </div>
                        </div>

                        {/* 코스 설명 */}
                        {course.description && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">코스 소개</h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {course.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* 학습 목표 */}
                        {course.learning_objectives && course.learning_objectives.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Target className="w-6 h-6 text-orange-400" />
                                    학습 목표
                                </h2>
                                <ul className="space-y-3">
                                    {course.learning_objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-300">{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 대상 학습자 */}
                        {course.target_audience && course.target_audience.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4">이런 분들께 추천해요</h2>
                                <ul className="space-y-3">
                                    {course.target_audience.map((audience, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Users className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-300">{audience}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 태그 */}
                        {course.tags && course.tags.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <Tag className="w-6 h-6 text-mint-400" />
                                    태그
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {course.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 cursor-pointer transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 사이드바 */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* 수강신청 카드 */}
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 mb-6">
                                {/* 진도 표시 (수강 중인 경우) */}
                                {isEnrolled && enrollment && (
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-300">진도율</span>
                                            <span className="text-sm font-medium text-cyan-400">
                                                {Math.round(enrollment.progress_percentage)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${enrollment.progress_percentage}%` }}
                                            />
                                        </div>
                                        {enrollment.is_completed && (
                                            <div className="flex items-center gap-2 mt-3 text-green-400">
                                                <Award className="w-5 h-5" />
                                                <span className="text-sm font-medium">완료!</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 액션 버튼들 */}
                                <div className="space-y-3">
                                    {!user ? (
                                        <button
                                            onClick={() => router.push('/auth/signin')}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Lock className="w-5 h-5" />
                                            로그인 후 수강신청
                                        </button>
                                    ) : !isEnrolled ? (
                                        <button
                                            onClick={handleEnroll}
                                            disabled={enrolling}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            {enrolling ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    처리 중...
                                                </>
                                            ) : (
                                                <>
                                                    <PlayCircle className="w-5 h-5" />
                                                    {course.is_free ? '무료 수강신청' : `₩${course.price.toLocaleString()} 수강신청`}
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleStartLearning}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-5 h-5" />
                                            {enrollment?.progress_percentage === 0 ? '학습 시작' : '이어서 학습'}
                                        </button>
                                    )}

                                    {/* 부가 액션 버튼들 */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleBookmark}
                                            className={`flex-1 px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 ${isBookmarked
                                                    ? 'border-red-600 text-red-400 bg-red-900/20'
                                                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                                                }`}
                                        >
                                            {isBookmarked ? (
                                                <Heart className="w-4 h-4 fill-current" />
                                            ) : (
                                                <Heart className="w-4 h-4" />
                                            )}
                                            <span className="text-sm">찜</span>
                                        </button>
                                        <button className="flex-1 px-4 py-2 border border-gray-600 text-gray-400 hover:border-gray-500 rounded-lg transition-colors flex items-center justify-center gap-2">
                                            <Share2 className="w-4 h-4" />
                                            <span className="text-sm">공유</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 학습 통계 카드 (수강 중인 경우) */}
                            {isEnrolled && enrollment && (
                                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                                        학습 통계
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">완료한 레슨</span>
                                            <span className="font-medium">
                                                {enrollment.completed_lessons?.length || 0}개
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">총 학습 시간</span>
                                            <span className="font-medium">
                                                {Math.round((enrollment.total_study_time_minutes || 0) / 60 * 10) / 10}시간
                                            </span>
                                        </div>
                                        {enrollment.rating && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">내 평점</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="font-medium">{enrollment.rating}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 