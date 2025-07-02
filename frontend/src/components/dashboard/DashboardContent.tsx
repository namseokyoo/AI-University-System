'use client'

import { useAuth } from '@/contexts/AuthContext'
import CourseList from '@/components/courses/CourseList'

export default function DashboardContent() {
    const { user, signOut } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('로그아웃 오류:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                AI University System
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                안녕하세요, {user?.user_metadata?.full_name || user?.email}님!
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            {/* 메인 컨텐츠 */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* 사용자 정보 카드 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-white font-medium">
                                                {user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                사용자 정보
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {user?.user_metadata?.full_name || '이름 없음'}
                                            </dd>
                                            <dd className="text-sm text-gray-500">
                                                {user?.email}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 학습 진도 카드 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                학습 진도
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                0%
                                            </dd>
                                            <dd className="text-sm text-gray-500">
                                                아직 시작하지 않음
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 등록 코스 카드 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                등록 코스
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                0개
                                            </dd>
                                            <dd className="text-sm text-gray-500">
                                                코스를 등록해보세요
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 최신 코스 목록 */}
                    <div className="mt-8">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            최신 코스
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            새롭게 추가된 코스들을 확인해보세요.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = '/courses'}
                                        className="text-blue-600 text-sm font-medium hover:text-blue-500"
                                    >
                                        전체 보기 →
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <CourseList
                                    showFilters={false}
                                    showCreateButton={false}
                                    onCourseClick={(course) => {
                                        window.location.href = `/courses/${course.slug}`;
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 시작하기 섹션 */}
                    <div className="mt-8">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    시작하기
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    AI University System에서 학습을 시작해보세요.
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                        <h4 className="text-base font-medium text-gray-900 mb-2">
                                            🤖 AI 기초 코스
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            인공지능의 기본 개념부터 시작하는 입문 코스입니다.
                                        </p>
                                        <button className="text-blue-600 text-sm font-medium hover:text-blue-500">
                                            코스 둘러보기 →
                                        </button>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                        <h4 className="text-base font-medium text-gray-900 mb-2">
                                            📚 학습 계획 설정
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-3">
                                            개인 맞춤형 학습 계획을 세워보세요.
                                        </p>
                                        <button className="text-blue-600 text-sm font-medium hover:text-blue-500">
                                            계획 설정하기 →
                                        </button>
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