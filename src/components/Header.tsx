'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: '首页', href: '/' },
  { label: '产品中心', href: '/products' },
  { label: '施工工艺', href: '/techniques' },
  { label: '课程中心', href: '/courses' },
  { label: '关于学院', href: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-2xl font-bold" style={{ color: '#E8A020' }}>佰利</span>
            <span className="text-xl font-semibold" style={{ color: '#0A3D5C' }}>涂装应用学院</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#0A3D5C] transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E8A020] group-hover:w-full transition-all duration-200" />
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/courses"
              className="px-5 py-2 rounded-md text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: '#E8A020' }}
            >
              立即报名
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#0A3D5C] hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#0A3D5C] hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href="/courses"
                className="block w-full text-center px-5 py-2 rounded-md text-sm font-semibold text-white"
                style={{ backgroundColor: '#E8A020' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                立即报名
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
