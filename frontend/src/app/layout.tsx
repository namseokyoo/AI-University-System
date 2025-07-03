import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
})

export const metadata: Metadata = {
    title: 'AI University System',
    description: 'AI 기반 대학 교육 시스템 - 초보자부터 전문가까지',
    keywords: ['AI', '교육', '대학', '기계학습', '딥러닝'],
    authors: [{ name: 'AI University Team' }],
}

export const viewport = 'width=device-width, initial-scale=1'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko" data-theme="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className={`${inter.variable} font-sans antialiased`}>
                <AuthProvider>
                    <div className="min-h-screen bg-background text-foreground">
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
} 