'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
    const [backendStatus, setBackendStatus] = useState<string>('연결 확인 중...')

    useEffect(() => {
        // 백엔드 연결 상태 확인
        const checkBackendStatus = async () => {
            try {
                const response = await fetch('http://localhost:8000/health')
                if (response.ok) {
                    setBackendStatus('연결됨 ✅')
                } else {
                    setBackendStatus('연결 실패 ❌')
                }
            } catch (error) {
                setBackendStatus('백엔드 서버 미실행 ⚠️')
            }
        }

        checkBackendStatus()
    }, [])

    return (
        <div className="container mx-auto px-4 py-16">
            {/* 헤더 섹션 */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    AI University System
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                    AI를 배우는 모든 이들을 위한 개인화된 대학 교육 플랫폼
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="btn-primary text-lg px-8 py-3 rounded-lg">
                        학습 시작하기
                    </button>
                    <button className="border border-border px-8 py-3 rounded-lg hover:bg-accent transition-colors">
                        둘러보기
                    </button>
                </div>
            </div>

            {/* 상태 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">🚀 시스템 상태</h3>
                    <p className="text-muted-foreground">Phase 1.1 - 프로젝트 기반 구축</p>
                    <div className="mt-2">
                        <span className="text-sm">백엔드: {backendStatus}</span>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">📚 커리큘럼</h3>
                    <p className="text-muted-foreground">AI 기초부터 고급까지</p>
                    <div className="mt-2">
                        <span className="text-sm text-green-600">개발 중 🔨</span>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-2">🤖 AI 튜터</h3>
                    <p className="text-muted-foreground">개인화된 학습 지원</p>
                    <div className="mt-2">
                        <span className="text-sm text-yellow-600">준비 중 ⏳</span>
                    </div>
                </div>
            </div>

            {/* 특징 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">개인화 학습</h3>
                    <p className="text-sm text-muted-foreground">
                        개인의 실력과 목표에 맞춘 맞춤형 커리큘럼
                    </p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📖</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">풍부한 콘텐츠</h3>
                    <p className="text-sm text-muted-foreground">
                        텍스트, 그래프, 영상을 활용한 다양한 학습 자료
                    </p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI 채팅 튜터</h3>
                    <p className="text-sm text-muted-foreground">
                        24시간 언제든지 질문하고 답변받는 AI 튜터
                    </p>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">진도 추적</h3>
                    <p className="text-sm text-muted-foreground">
                        실시간 학습 진도 및 성취도 분석
                    </p>
                </div>
            </div>

            {/* 개발 진행 상황 */}
            <div className="card p-8">
                <h2 className="text-2xl font-bold mb-6">🚧 개발 진행 상황</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>✅ Phase 1.1: 프로젝트 기반 구축</span>
                        <span className="text-green-600 font-medium">완료</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>🔄 Phase 1.2: 외부 서비스 연동</span>
                        <span className="text-yellow-600 font-medium">진행 중</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>⏳ Phase 2: 인증 및 사용자 관리</span>
                        <span className="text-gray-400 font-medium">대기 중</span>
                    </div>
                </div>
            </div>

            {/* 푸터 */}
            <footer className="text-center mt-16 pt-8 border-t border-border">
                <p className="text-muted-foreground">
                    AI University System v1.0.0 - 개발 중인 프로토타입
                </p>
            </footer>
        </div>
    )
} 