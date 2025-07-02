'use client';

import React, { useState, useEffect } from 'react';
import { CourseSummary, CourseFilters, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/types/course';
import { courseService } from '@/lib/courseService';
import { Clock, Users, Star, BookOpen, Search, Filter } from 'lucide-react';

interface CourseListProps {
    showFilters?: boolean;
    showCreateButton?: boolean;
    onCourseClick?: (course: CourseSummary) => void;
    onCreateClick?: () => void;
    initialFilters?: CourseFilters;
}

export default function CourseList({
    showFilters = true,
    showCreateButton = false,
    onCourseClick,
    onCreateClick,
    initialFilters = {}
}: CourseListProps) {
    const [courses, setCourses] = useState<CourseSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<CourseFilters>(initialFilters);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    // 코스 목록 로드
    const loadCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const courseList = await courseService.getPublishedCourses({
                skip: 0,
                limit: 50
            });

            setCourses(courseList);
        } catch (err) {
            setError(err instanceof Error ? err.message : '코스 목록을 불러올 수 없습니다');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    // 검색 및 필터링
    const filteredCourses = courses.filter(course => {
        // 검색어 필터
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!course.title.toLowerCase().includes(query) &&
                !course.short_description?.toLowerCase().includes(query) &&
                !course.tags.some(tag => tag.toLowerCase().includes(query))) {
                return false;
            }
        }

        // 난이도 필터
        if (filters.difficulty_level && course.difficulty_level !== filters.difficulty_level) {
            return false;
        }

        // 태그 필터
        if (filters.tags?.length) {
            if (!filters.tags.some(tag => course.tags.includes(tag))) {
                return false;
            }
        }

        return true;
    });

    const handleCourseClick = (course: CourseSummary) => {
        if (onCourseClick) {
            onCourseClick(course);
        } else {
            // 기본 동작: 코스 상세 페이지로 이동
            window.location.href = `/courses/${course.slug}`;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">코스 목록을 불러오는 중...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={loadCourses}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">코스 목록</h2>
                    <p className="text-gray-600">{filteredCourses.length}개의 코스를 찾았습니다</p>
                </div>

                {showCreateButton && (
                    <button
                        onClick={onCreateClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        새 코스 만들기
                    </button>
                )}
            </div>

            {/* 검색 및 필터 */}
            {showFilters && (
                <div className="space-y-4">
                    {/* 검색 바 */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="코스 제목, 설명, 태그로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* 필터 버튼 */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilterPanel(!showFilterPanel)}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter className="w-4 h-4" />
                            필터
                        </button>

                        {/* 활성 필터 표시 */}
                        {filters.difficulty_level && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[filters.difficulty_level]}`}>
                                {DIFFICULTY_LABELS[filters.difficulty_level]}
                            </span>
                        )}
                    </div>

                    {/* 필터 패널 */}
                    {showFilterPanel && (
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                            {/* 난이도 필터 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, difficulty_level: undefined }))}
                                        className={`px-3 py-1 rounded-full text-sm ${!filters.difficulty_level
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        전체
                                    </button>
                                    {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFilters(prev => ({
                                                ...prev,
                                                difficulty_level: key as any
                                            }))}
                                            className={`px-3 py-1 rounded-full text-sm ${filters.difficulty_level === key
                                                    ? DIFFICULTY_COLORS[key as keyof typeof DIFFICULTY_COLORS]
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 코스 그리드 */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">코스가 없습니다</h3>
                    <p className="text-gray-600">
                        {searchQuery || Object.keys(filters).length > 0
                            ? '검색 조건에 맞는 코스가 없습니다. 필터를 조정해보세요.'
                            : '아직 등록된 코스가 없습니다.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course)}
                            className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        >
                            {/* 썸네일 영역 */}
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                                {course.thumbnail_url ? (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <BookOpen className="w-12 h-12 text-white/70" />
                                    </div>
                                )}

                                {/* 난이도 배지 */}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[course.difficulty_level]}`}>
                                        {DIFFICULTY_LABELS[course.difficulty_level]}
                                    </span>
                                </div>
                            </div>

                            {/* 콘텐츠 영역 */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>

                                {course.short_description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {course.short_description}
                                    </p>
                                )}

                                {/* 메타 정보 */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-4">
                                        {course.estimated_duration_hours && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.estimated_duration_hours}시간</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{course.enrolled_count}명</span>
                                        </div>
                                    </div>

                                    {course.rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span>{course.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* 태그 */}
                                {course.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {course.tags.slice(0, 3).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {course.tags.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                +{course.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* 가격 */}
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-bold text-gray-900">
                                        {course.is_free ? (
                                            <span className="text-green-600">무료</span>
                                        ) : (
                                            <span>₩{course.price.toLocaleString()}</span>
                                        )}
                                    </div>

                                    <button className="text-blue-600 hover:text-blue-700 font-medium group-hover:underline">
                                        자세히 보기 →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 