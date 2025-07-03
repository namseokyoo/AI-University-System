'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
    onSuccess?: () => void
    redirectTo?: string
}

export default function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { signIn } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await signIn(email, password)

            if (onSuccess) {
                onSuccess()
            } else {
                router.push(redirectTo)
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : '로그인에 실패했습니다.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                    로그인
                </h2>
                <p className="text-text-secondary">
                    AI University 계정으로 로그인하세요
                </p>
            </div>

            {error && (
                <div className="bg-bg-tertiary border border-error/30 text-error px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        이메일 주소
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                        placeholder="your@email.com"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                        비밀번호
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                        placeholder="비밀번호를 입력하세요"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-bg-primary border-t-transparent"></div>
                            <span>로그인 중...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span>로그인</span>
                        </div>
                    )}
                </button>
            </form>

            <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                    <a
                        href="/auth/forgot-password"
                        className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                        비밀번호를 잊으셨나요?
                    </a>
                    <a
                        href="/auth/help"
                        className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                    >
                        로그인 도움말
                    </a>
                </div>
            </div>
        </div>
    )
} 