import SignupForm from '@/components/auth/SignupForm'

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        AI University System
                    </h1>
                    <p className="text-sm text-gray-600">
                        AI와 함께하는 새로운 학습 경험을 시작하세요
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <SignupForm />
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    © 2024 AI University System. All rights reserved.
                </p>
            </div>
        </div>
    )
} 