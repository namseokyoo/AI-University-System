'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { authAPI, onAuthStateChange, User } from '@/lib/supabase'

// AuthContext 타입 정의
interface AuthContextType {
    user: User | null
    loading: boolean
    signUp: (email: string, password: string, fullName?: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider 컴포넌트
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 초기 세션 확인
        const getInitialSession = async () => {
            try {
                const session = await authAPI.getSession()
                setUser(session?.user as User | null)
            } catch (error) {
                console.error('세션 확인 오류:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getInitialSession()

        // 인증 상태 변화 구독
        const { data: { subscription } } = onAuthStateChange((user) => {
            setUser(user)
            setLoading(false)
        })

        // 컴포넌트 언마운트 시 구독 해제
        return () => subscription.unsubscribe()
    }, [])

    // 회원가입 함수
    const signUp = async (email: string, password: string, fullName?: string) => {
        try {
            setLoading(true)
            await authAPI.signUp(email, password, fullName)
            // 회원가입 후 이메일 확인 필요 메시지를 사용자에게 알려야 함
        } catch (error) {
            console.error('회원가입 오류:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // 로그인 함수
    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true)
            const { user } = await authAPI.signIn(email, password)
            setUser(user as User)
        } catch (error) {
            console.error('로그인 오류:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // 로그아웃 함수
    const signOut = async () => {
        try {
            setLoading(true)
            await authAPI.signOut()
            setUser(null)
        } catch (error) {
            console.error('로그아웃 오류:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // 비밀번호 재설정 함수
    const resetPassword = async (email: string) => {
        try {
            setLoading(true)
            await authAPI.resetPassword(email)
        } catch (error) {
            console.error('비밀번호 재설정 오류:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// useAuth 커스텀 훅
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.')
    }
    return context
}

// 인증된 사용자만 접근 가능한 컴포넌트
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    // 로딩 중일 때
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // 사용자가 인증되지 않았을 때
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        로그인이 필요합니다
                    </h1>
                    <p className="text-gray-600 mb-4">
                        이 페이지에 접근하려면 로그인해야 합니다.
                    </p>
                    <a
                        href="/auth/signin"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        로그인하기
                    </a>
                </div>
            </div>
        )
    }

    // 인증된 사용자일 때 자식 컴포넌트 렌더링
    return <>{children}</>
} 