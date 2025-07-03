import SignupForm from '@/components/auth/SignupForm'

export default function SignUpPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-primary to-bg-secondary opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-radial from-accent-secondary/5 via-transparent to-transparent"></div>

            <div className="relative z-10">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-accent-secondary via-accent-primary to-accent-tertiary bg-clip-text text-transparent">
                                AI University
                            </span>
                            <br />
                            <span className="text-text-primary text-2xl font-medium">
                                System
                            </span>
                        </h1>
                        <p className="text-text-secondary text-lg">
                            AI와 함께하는 새로운 학습 경험을 시작하세요
                        </p>
                        <div className="mt-4 w-20 h-1 bg-gradient-to-r from-accent-secondary to-accent-primary mx-auto rounded-full"></div>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="card-glass">
                        <SignupForm />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="flex justify-center items-center space-x-4 mb-4">
                        <div className="w-12 h-px bg-border-primary"></div>
                        <span className="text-text-tertiary text-sm">또는</span>
                        <div className="w-12 h-px bg-border-primary"></div>
                    </div>
                    <p className="text-text-secondary">
                        이미 계정이 있으신가요?{' '}
                        <a href="/auth/signin" className="text-accent-secondary hover:text-accent-primary transition-colors font-medium">
                            로그인하기
                        </a>
                    </p>
                </div>

                <footer className="mt-16 text-center">
                    <p className="text-text-muted text-sm">
                        © 2024 AI University System. 모든 권리 보유.
                    </p>
                </footer>
            </div>
        </div>
    )
} 