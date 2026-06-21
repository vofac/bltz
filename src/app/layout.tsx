import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.baili-academy.com'

export const metadata: Metadata = {
  title: {
    default: '佰利涂装应用学院 - 专业涂装技术培训',
    template: '%s | 佰利涂装应用学院',
  },
  description: '佰利涂装应用学院专注于涂装技术培训，提供艺术漆、质感涂料、功能涂料等专业施工工艺培训课程，助力涂装从业者技能提升。',
  keywords: ['涂装培训', '艺术漆', '仿石漆', '施工工艺', '涂装学院', '佰利', '藻泥涂料', '硅藻泥'],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    siteName: '佰利涂装应用学院',
    title: '佰利涂装应用学院 - 专业涂装技术培训',
    description: '佰利涂装应用学院专注于涂装技术培训，提供艺术漆、质感涂料、功能涂料等专业施工工艺培训课程。',
  },
  twitter: {
    card: 'summary_large_image',
    title: '佰利涂装应用学院 - 专业涂装技术培训',
    description: '专注涂装教育10年，系统学习施工工艺，提升职业竞争力。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: '佰利涂装应用学院',
  description: '专注于建筑涂装技术培训的专业院校，提供艺术漆、质感涂料、施工工艺等系统课程',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  foundingDate: '2015',
  telephone: '400-888-8888',
  email: 'info@baili-academy.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: '广州市',
    addressRegion: '广东省',
    streetAddress: '天河区涂装产业园A栋108室',
    addressCountry: 'CN',
  },
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F8F9FA]">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
