import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
        <html lang="ko" suppressHydrationWarning>
            <body className={inter.className}>
                <div className="min-h-screen bg-background font-sans antialiased">
                    {children}
                </div>
            </body>
        </html>
    )
} 