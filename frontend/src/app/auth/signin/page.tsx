import LoginForm from '@/components/auth/LoginForm'

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AI University System
                    </h1>
                    <p className="text-sm text-gray-600">
                        AI 기반 대학 교육 시스템에 오신 것을 환영합니다
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <LoginForm />
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    © 2024 AI University System. All rights reserved.
                </p>
            </div>
        </div>
    )
} 