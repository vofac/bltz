import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '佰利涂装应用学院 - 专业涂装技术培训',
  description: '佰利涂装应用学院专注于涂装技术培训，提供艺术漆、质感涂料、功能涂料等专业施工工艺培训课程，助力涂装从业者技能提升。',
  keywords: '涂装培训, 艺术漆, 仿石漆, 施工工艺, 涂装学院, 佰利',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col bg-[#F8F9FA]">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
