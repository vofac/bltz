'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Clock, BookOpen, Users, ChevronRight, Award, CheckCircle } from 'lucide-react'

const levels = ['全部', '入门', '进阶', '高级', '认证']

const courses = [
  {
    id: 1,
    title: '涂装基础入门',
    instructor: '张建国',
    level: '入门',
    duration: '4周',
    lessons: 8,
    rating: 4.8,
    price: '免费',
    priceNum: 0,
    students: 1256,
    gradient: 'from-[#0A3D5C] to-[#1E6B8C]',
    tags: ['零基础', '必学', '入门首选'],
    desc: '零基础学员的最佳起点，系统讲解涂装行业基础知识、常用材料认知及基本施工规范，帮助学员建立完整的涂装知识体系。',
    highlights: ['行业基础知识', '常用工具认识', '安全施工规范', '基础施工操作'],
  },
  {
    id: 2,
    title: '乳胶漆施工全解',
    instructor: '李明华',
    level: '入门',
    duration: '6周',
    lessons: 12,
    rating: 4.7,
    price: '¥199',
    priceNum: 199,
    students: 856,
    gradient: 'from-[#1E6B8C] to-[#2980A8]',
    tags: ['实用', '高频', '就业必备'],
    desc: '深入讲解普通乳胶漆施工全流程，从基底处理、底漆施工到面漆涂刷，全方位掌握乳胶漆施工技术，适合准备进入涂装行业的学员。',
    highlights: ['基底处理规范', '底漆施工技法', '面漆涂刷技巧', '常见问题处理'],
  },
  {
    id: 3,
    title: '艺术漆技法精讲',
    instructor: '王艺涵',
    level: '进阶',
    duration: '10周',
    lessons: 20,
    rating: 4.9,
    price: '¥399',
    priceNum: 399,
    students: 634,
    gradient: 'from-[#E8A020] to-[#C47F10]',
    tags: ['精品', '热门', '高薪技能'],
    desc: '专业艺术漆施工技法深度讲解，涵盖仿石漆、艺术肌理漆、金属质感漆等多种高端涂装材料的施工工艺，助您掌握高附加值技能。',
    highlights: ['仿石漆喷涂工艺', '肌理漆创作技法', '金属质感处理', '艺术效果调配'],
  },
  {
    id: 4,
    title: '仿石漆专业施工',
    instructor: '陈师傅',
    level: '进阶',
    duration: '8周',
    lessons: 15,
    rating: 4.8,
    price: '¥299',
    priceNum: 299,
    students: 423,
    gradient: 'from-[#808080] to-[#505050]',
    tags: ['专项技能', '实战', '外墙专精'],
    desc: '专注仿石漆施工技术，深入讲解仿石漆的材料特性、喷涂技法、纹理调配及质量控制，是外立面装饰施工的专精课程。',
    highlights: ['仿石漆材料认知', '专业喷枪操作', '纹理效果控制', '外立面施工规范'],
  },
  {
    id: 5,
    title: '高端涂装设计',
    instructor: '刘设计师',
    level: '高级',
    duration: '15周',
    lessons: 30,
    rating: 4.9,
    price: '¥599',
    priceNum: 599,
    students: 287,
    gradient: 'from-[#2C3E50] to-[#0A3D5C]',
    tags: ['高端', '设计融合', '进阶必修'],
    desc: '将涂装技术与室内设计理念相结合，学习高端定制涂装方案设计、效果图制作及与客户的沟通技巧，全面提升综合设计能力。',
    highlights: ['涂装设计理念', '色彩搭配技法', '效果图制作', '客户方案呈现'],
  },
  {
    id: 6,
    title: '佰利认证工程师',
    instructor: '多位专家',
    level: '认证',
    duration: '20周',
    lessons: 40,
    rating: 5.0,
    price: '¥999',
    priceNum: 999,
    students: 156,
    gradient: 'from-[#0A3D5C] to-[#E8A020]',
    tags: ['官方认证', '含证书', '最高荣誉'],
    desc: '佰利学院最高级别认证课程，由多位行业专家联合授课，全面覆盖涂装施工、项目管理、质量控制等核心能力，结业颁发官方认证证书。',
    highlights: ['全面系统培训', '多位专家授课', '项目实战演练', '官方认证证书'],
  },
]

const learningPath = [
  {
    phase: '第一阶段',
    title: '基础筑基',
    color: '#1E6B8C',
    courses: ['涂装基础入门', '乳胶漆施工全解'],
    desc: '建立扎实的涂装基础知识，掌握基本施工规范',
  },
  {
    phase: '第二阶段',
    title: '技能进阶',
    color: '#E8A020',
    courses: ['艺术漆技法精讲', '仿石漆专业施工'],
    desc: '深入学习特种涂料施工技法，掌握高附加值技能',
  },
  {
    phase: '第三阶段',
    title: '高端突破',
    color: '#0A3D5C',
    courses: ['高端涂装设计', '佰利认证工程师'],
    desc: '综合提升设计能力，获取权威认证资质',
  },
]

const levelColors: Record<string, { bg: string; text: string }> = {
  入门: { bg: '#1E6B8C', text: 'white' },
  进阶: { bg: '#E8A020', text: 'white' },
  高级: { bg: '#0A3D5C', text: 'white' },
  认证: { bg: '#8B4513', text: 'white' },
}

export default function CoursesPage() {
  const [activeLevel, setActiveLevel] = useState('全部')

  const filtered = activeLevel === '全部'
    ? courses
    : courses.filter((c) => c.level === activeLevel)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">首页</Link>
            <ChevronRight size={14} />
            <span>课程中心</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">课程中心</h1>
          <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
            从零基础到专业认证，系统化涂装培训体系。我们提供最全面的涂装技术课程，
            助您快速提升技能，开拓职业发展空间。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { value: '6', label: '精品课程' },
              { value: '12+', label: '专业讲师' },
              { value: '3612+', label: '学员报名' },
              { value: '4.85', label: '平均评分' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-[#E8A020]">{stat.value}</div>
                <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Level Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-3 overflow-x-auto">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeLevel === level
                    ? 'bg-[#0A3D5C] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-gray-500 text-sm">
              共 <span className="font-semibold text-[#0A3D5C]">{filtered.length}</span> 门课程
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => {
              const lvlColor = levelColors[course.level] || { bg: '#0A3D5C', text: 'white' }
              return (
                <div key={course.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  {/* Gradient placeholder */}
                  <div className={`h-48 bg-gradient-to-br ${course.gradient} relative flex flex-col items-center justify-center text-white`}>
                    <BookOpen size={44} className="opacity-70 mb-2" />
                    <span className="text-sm opacity-60">{course.duration} · {course.lessons}课时</span>
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {course.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-black/30 text-white font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Level badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: lvlColor.bg, color: lvlColor.text }}
                      >
                        {course.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i <= Math.round(course.rating) ? 'text-yellow-400' : 'text-gray-200'}
                          fill={i <= Math.round(course.rating) ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="text-sm font-semibold text-gray-700 ml-1">{course.rating}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0A3D5C] mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 leading-relaxed flex-1">{course.desc}</p>

                    {/* Highlights */}
                    <ul className="space-y-1 mb-4">
                      {course.highlights.map((h) => (
                        <li key={h} className="flex items-center space-x-2 text-xs text-gray-600">
                          <CheckCircle size={12} className="text-[#1E6B8C] flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen size={12} />
                        <span>{course.lessons}课时</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users size={12} />
                        <span>{course.students.toLocaleString()}人</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <span className="text-xl font-bold text-[#E8A020]">{course.price}</span>
                        {course.priceNum > 0 && (
                          <span className="text-xs text-gray-400 ml-1">/ 全套课程</span>
                        )}
                      </div>
                      <button className="px-4 py-2 bg-[#0A3D5C] text-white rounded-lg text-sm font-semibold hover:bg-[#1E6B8C] transition-colors duration-200">
                        立即报名
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0A3D5C] mb-3">学习路径推荐</h2>
            <p className="text-gray-500 max-w-xl mx-auto">按照推荐学习路径循序渐进，系统掌握涂装技能，最终获得专业认证</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPath.map((phase, index) => (
              <div key={phase.phase} className="relative">
                <div className="bg-[#F8F9FA] rounded-xl p-6 border-t-4" style={{ borderColor: phase.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: phase.color }}>
                      {phase.phase}
                    </span>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: phase.color }}>
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A3D5C] mb-2">{phase.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{phase.desc}</p>
                  <ul className="space-y-2">
                    {phase.courses.map((c) => (
                      <li key={c} className="flex items-center space-x-2 text-sm">
                        <CheckCircle size={14} style={{ color: phase.color }} />
                        <span className="text-gray-700">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {index < learningPath.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 items-center justify-center w-6 h-6 bg-white rounded-full shadow border border-gray-200">
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="py-12 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0A3D5C] to-[#1E6B8C] rounded-2xl p-8 text-white text-center">
            <Award size={48} className="text-[#E8A020] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">佰利认证工程师证书</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              完成认证课程后，颁发由佰利涂装应用学院官方认可的专业工程师证书，
              在200余家合作企业中广泛认可，助力您的职业发展。
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { value: '200+', label: '合作企业认可' },
                { value: '156', label: '已认证工程师' },
                { value: '5.0', label: '课程满意度' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-lg p-3">
                  <div className="text-xl font-bold text-[#E8A020]">{stat.value}</div>
                  <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <button className="px-8 py-3 rounded-lg font-bold text-[#0A3D5C] bg-[#E8A020] hover:opacity-90 transition-all duration-200">
              申请认证课程
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
