'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function HomePage() {
    const [backendStatus, setBackendStatus] = useState<string>('연결 확인 중...')
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // 인증된 사용자는 대시보드로 리다이렉트
        if (!loading && user) {
            router.push('/dashboard')
        }
    }, [user, loading, router])

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

    // 로딩 중일 때
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-2 border-accent-primary border-t-transparent"></div>
                    <p className="text-text-secondary">AI University 시스템 로딩 중...</p>
                </div>
            </div>
        )
    }

    // 인증된 사용자는 대시보드로 리다이렉트 (이미 위에서 처리됨)
    if (user) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-radial from-accent-primary/5 via-transparent to-transparent"></div>

                <div className="relative container mx-auto px-6 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Main Title */}
                        <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-none">
                            <span className="bg-gradient-to-r from-accent-primary via-accent-tertiary to-accent-secondary bg-clip-text text-transparent">
                                AI University
                            </span>
                            <br />
                            <span className="text-text-primary text-4xl lg:text-5xl font-medium">
                                System
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl lg:text-2xl text-text-secondary mb-12 leading-relaxed">
                            인공지능을 배우는 모든 이들을 위한<br />
                            <span className="text-accent-primary font-medium">개인화된 프리미엄 교육 플랫폼</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                            <a
                                href="/auth/signin"
                                className="btn-primary text-lg px-10 py-4 hover-lift"
                            >
                                학습 시작하기
                            </a>
                            <a
                                href="/auth/signup"
                                className="btn-secondary text-lg px-10 py-4 hover-lift"
                            >
                                무료 체험
                            </a>
                        </div>

                        {/* Status Indicator */}
                        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-bg-tertiary/50 backdrop-blur-sm border border-border-primary rounded-full">
                            <div className="w-3 h-3 bg-accent-tertiary rounded-full animate-pulse"></div>
                            <span className="text-text-secondary text-sm">백엔드 상태: {backendStatus}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-text-primary mb-4">
                            왜 AI University인가?
                        </h2>
                        <p className="text-xl text-text-secondary">
                            차세대 교육 기술로 구현된 최고의 학습 경험
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="card hover-lift text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-primary transition-all duration-300">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">개인화 AI 튜터</h3>
                            <p className="text-text-secondary leading-relaxed">
                                당신의 학습 스타일과 속도에 맞춘<br />
                                완전히 개인화된 AI 교육 시스템
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="card hover-lift text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-secondary to-accent-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-accent transition-all duration-300">
                                <span className="text-3xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">실시간 진도 분석</h3>
                            <p className="text-text-secondary leading-relaxed">
                                학습 패턴 분석과 성취도 추적으로<br />
                                최적화된 학습 경로 제공
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="card hover-lift text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-tertiary to-accent-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-primary transition-all duration-300">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">최신 AI 기술</h3>
                            <p className="text-text-secondary leading-relaxed">
                                업계 최신 트렌드와 기술을<br />
                                실시간으로 반영한 커리큘럼
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="card hover-lift text-center group">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-tertiary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-accent transition-all duration-300">
                                <span className="text-3xl">💎</span>
                            </div>
                            <h3 className="text-xl font-semibold text-text-primary mb-4">프리미엄 품질</h3>
                            <p className="text-text-secondary leading-relaxed">
                                전문가가 검증한 고품질 콘텐츠와<br />
                                업계 표준 수준의 교육 과정
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Development Progress */}
            <section className="py-20 px-6 bg-bg-secondary">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-text-primary mb-4">
                            🚧 개발 진행 현황
                        </h2>
                        <p className="text-text-secondary">
                            AI University 시스템의 실시간 개발 상황
                        </p>
                    </div>

                    <div className="card-glass">
                        <div className="space-y-6">
                            {/* Phase 1 */}
                            <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-4 h-4 bg-accent-tertiary rounded-full"></div>
                                    <span className="text-text-primary font-medium">Phase 1: 프로젝트 기반 구축</span>
                                </div>
                                <span className="status-success font-semibold">완료</span>
                            </div>

                            {/* Phase 2.4 */}
                            <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-4 h-4 bg-accent-tertiary rounded-full"></div>
                                    <span className="text-text-primary font-medium">Phase 2.4: 백엔드 인증 시스템</span>
                                </div>
                                <span className="status-success font-semibold">완료</span>
                            </div>

                            {/* Phase 2.5 */}
                            <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-4 h-4 bg-accent-tertiary rounded-full"></div>
                                    <span className="text-text-primary font-medium">Phase 2.5: 프론트엔드 인증 시스템</span>
                                </div>
                                <span className="status-success font-semibold">완료</span>
                            </div>

                            {/* Phase 3 */}
                            <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-lg border border-accent-primary/30">
                                <div className="flex items-center space-x-4">
                                    <div className="w-4 h-4 bg-accent-primary rounded-full animate-pulse"></div>
                                    <span className="text-text-primary font-medium">Phase 3: 코스 관리 시스템</span>
                                </div>
                                <span className="status-info font-semibold">진행 중</span>
                            </div>

                            {/* Design System */}
                            <div className="flex items-center justify-between p-4 bg-bg-tertiary/30 rounded-lg border border-accent-primary/30">
                                <div className="flex items-center space-x-4">
                                    <div className="w-4 h-4 bg-accent-primary rounded-full animate-pulse"></div>
                                    <span className="text-text-primary font-medium">블랙 테마 디자인 시스템</span>
                                </div>
                                <span className="status-success font-semibold">적용 완료</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-border-primary">
                <div className="container mx-auto text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-text-primary mb-2">AI University System</h3>
                        <p className="text-text-secondary">차세대 AI 교육 플랫폼</p>
                    </div>
                    <div className="flex justify-center space-x-8 mb-8">
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">소개</a>
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">커리큘럼</a>
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">지원</a>
                        <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">문의</a>
                    </div>
                    <p className="text-text-muted text-sm">
                        © 2024 AI University System. 모든 권리 보유. | 개발 중인 프로토타입 v1.0.0
                    </p>
                </div>
            </footer>
        </div>
    )
} 