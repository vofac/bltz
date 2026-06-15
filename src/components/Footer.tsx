import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0A3D5C' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-1 mb-4">
              <span className="text-2xl font-bold" style={{ color: '#E8A020' }}>佰利</span>
              <span className="text-xl font-semibold text-white">涂装应用学院</span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              专注于涂装技术培训与推广，传授专业施工工艺，培育高素质涂装人才，助力行业健康发展。
            </p>
          </div>

          {/* Quick Links Column 1 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#E8A020' }}>
              产品与课程
            </h3>
            <ul className="space-y-2">
              {[
                { label: '产品中心', href: '/products' },
                { label: '艺术漆系列', href: '/products' },
                { label: '质感涂料', href: '/products' },
                { label: '课程中心', href: '/courses' },
                { label: '认证课程', href: '/courses' },
              ].map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#E8A020' }}>
              学院信息
            </h3>
            <ul className="space-y-2">
              {[
                { label: '关于学院', href: '/about' },
                { label: '施工工艺', href: '/techniques' },
                { label: '师资团队', href: '/about' },
                { label: '学员案例', href: '/about' },
                { label: '联系我们', href: '/about' },
              ].map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-blue-200 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#E8A020' }}>
              联系方式
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-blue-300 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-200">广东省广州市天河区涂装产业园A栋108室</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-blue-300 flex-shrink-0" />
                <span className="text-sm text-blue-200">400-888-8888</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-blue-300 flex-shrink-0" />
                <span className="text-sm text-blue-200">info@baili-academy.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Clock size={16} className="text-blue-300 flex-shrink-0" />
                <span className="text-sm text-blue-200">周一至周六 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-blue-300">
            © 2024 佰利涂装应用学院. 保留所有权利.
          </p>
          <p className="text-sm text-blue-300">
            粤ICP备2024000001号
          </p>
        </div>
      </div>
    </footer>
  )
}
