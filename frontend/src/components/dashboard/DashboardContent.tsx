'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { enrollmentService } from '@/lib/enrollmentService'
import { EnrollmentStats, EnrollmentWithCourse } from '@/types/enrollment'
import CourseList from '@/components/courses/CourseList'
import {
    BookOpen,
    Clock,
    Award,
    BarChart3,
    TrendingUp,
    Play,
    Users,
    Star,
    ChevronRight,
    Target,
    Brain,
    Zap,
    Sparkles
} from 'lucide-react'

export default function DashboardContent() {
    const { user, signOut } = useAuth()
    const router = useRouter()

    const [stats, setStats] = useState<EnrollmentStats>({
        total_enrollments: 0,
        completed_courses: 0,
        in_progress_courses: 0,
        total_study_hours: 0,
        average_progress: 0
    })
    const [inProgressCourses, setInProgressCourses] = useState<EnrollmentWithCourse[]>([])
    const [loading, setLoading] = useState(true)

    // 대시보드 데이터 로드
    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user) return

            try {
                setLoading(true)
                const [statsData, progressCourses] = await Promise.all([
                    enrollmentService.getEnrollmentStats(),
                    enrollmentService.getInProgressCourses()
                ])

                setStats(statsData)
                setInProgressCourses(progressCourses)
            } catch (error) {
                console.error('Failed to load dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [user])

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('로그아웃 오류:', error)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* 헤더 */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                AI University System
                            </h1>
                            <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                안녕하세요, {user?.user_metadata?.full_name || user?.email}님!
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center px-4 py-2 border border-red-600/20 text-sm font-medium rounded-lg text-red-400 bg-red-900/20 hover:bg-red-900/30 hover:border-red-500/30 transition-all duration-200"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* 상단 통계 카드들 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* 등록 코스 수 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                                            <BookOpen className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="ml-4 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-400 truncate">
                                                등록 코스
                                            </dt>
                                            <dd className="text-2xl font-bold text-white">
                                                {loading ? '...' : stats.total_enrollments}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 완료 코스 수 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                                            <Award className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="ml-4 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-400 truncate">
                                                완료 코스
                                            </dt>
                                            <dd className="text-2xl font-bold text-white">
                                                {loading ? '...' : stats.completed_courses}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 총 학습 시간 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
                                            <Clock className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="ml-4 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-400 truncate">
                                                학습 시간
                                            </dt>
                                            <dd className="text-2xl font-bold text-white">
                                                {loading ? '...' : `${stats.total_study_hours}h`}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 평균 진도 */}
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="ml-4 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-400 truncate">
                                                평균 진도
                                            </dt>
                                            <dd className="text-2xl font-bold text-white">
                                                {loading ? '...' : `${stats.average_progress}%`}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 진행 중인 코스 섹션 */}
                    {!loading && inProgressCourses.length > 0 && (
                        <div className="mb-8">
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl">
                                <div className="px-6 py-4 border-b border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                                <Play className="w-5 h-5 text-cyan-400" />
                                                진행 중인 코스
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-400">
                                                현재 학습 중인 코스들을 계속 진행해보세요.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => router.push('/courses')}
                                            className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1 transition-colors"
                                        >
                                            전체 보기
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {inProgressCourses.slice(0, 3).map((enrollment) => (
                                            <div
                                                key={enrollment.id}
                                                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/courses/${enrollment.course.slug}`)}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="font-medium text-white line-clamp-2">
                                                        {enrollment.course.title}
                                                    </h4>
                                                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                                        {enrollment.course.difficulty_level}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-400">진도율</span>
                                                        <span className="text-cyan-400 font-medium">
                                                            {Math.round(enrollment.progress_percentage)}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{Math.round(enrollment.total_study_time_minutes / 60 * 10) / 10}h</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Target className="w-3 h-3" />
                                                        <span>{enrollment.completed_lessons?.length || 0}개 완료</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 최신 코스 목록 */}
                    <div className="mb-8">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl">
                            <div className="px-6 py-4 border-b border-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-orange-400" />
                                            최신 코스
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-400">
                                            새롭게 추가된 코스들을 확인해보세요.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/courses')}
                                        className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1 transition-colors"
                                    >
                                        전체 보기
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <CourseList
                                    showFilters={false}
                                    showCreateButton={false}
                                    onCourseClick={(course) => {
                                        router.push(`/courses/${course.slug}`);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 빠른 액션 섹션 */}
                    <div className="mb-8">
                        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl">
                            <div className="px-6 py-4 border-b border-gray-800">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-mint-400" />
                                    빠른 시작
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    AI University에서 학습을 시작해보세요.
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div
                                        className="border border-gray-700 bg-gray-800/30 rounded-xl p-6 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
                                        onClick={() => router.push('/courses')}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Brain className="h-5 w-5 text-white" />
                                            </div>
                                            <h4 className="text-base font-semibold text-white">
                                                AI 코스 탐색
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4">
                                            다양한 AI 분야의 코스들을 둘러보고 학습을 시작하세요.
                                        </p>
                                        <div className="flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors">
                                            <span>코스 둘러보기</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    <div
                                        className="border border-gray-700 bg-gray-800/30 rounded-xl p-6 hover:border-orange-500/50 hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group"
                                        onClick={() => router.push('/courses?create=ai')}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Sparkles className="h-5 w-5 text-white" />
                                            </div>
                                            <h4 className="text-base font-semibold text-white">
                                                AI 코스 생성
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4">
                                            AI가 당신만을 위한 맞춤형 코스를 자동으로 생성해드립니다.
                                        </p>
                                        <div className="flex items-center text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">
                                            <span>AI 코스 만들기</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
} 