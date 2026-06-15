import Link from 'next/link'
import {
  Award,
  BookOpen,
  Users,
  Star,
  ChevronRight,
  Shield,
  Zap,
  TrendingUp,
  Heart,
  CheckCircle,
} from 'lucide-react'

const stats = [
  { value: '10+', label: '年行业经验' },
  { value: '5000+', label: '培训学员' },
  { value: '200+', label: '合作企业' },
  { value: '98%', label: '学员满意度' },
]

const productCategories = [
  {
    title: '艺术漆系列',
    desc: '仿石漆、艺术肌理漆、金属质感漆，打造高端艺术空间效果',
    icon: '🎨',
    gradient: 'from-[#0A3D5C] to-[#1E6B8C]',
    items: ['仿石漆', '艺术肌理漆', '金属质感漆'],
  },
  {
    title: '质感涂料系列',
    desc: '藻泥涂料、硅藻泥，天然环保，调节空气湿度，打造健康居家',
    icon: '🌿',
    gradient: 'from-[#1E6B8C] to-[#2980A8]',
    items: ['藻泥涂料', '硅藻泥', '生态环保漆'],
  },
  {
    title: '功能涂料系列',
    desc: '弹性防水涂料、竹炭负离子漆，功能强大，保护您的建筑',
    icon: '🛡️',
    gradient: 'from-[#0A3D5C] to-[#0D5279]',
    items: ['弹性防水涂料', '竹炭负离子漆', '彩砂涂料'],
  },
]

const featuredCourses = [
  {
    title: '涂装基础入门',
    instructor: '张建国',
    level: '入门',
    duration: '4周',
    price: '免费',
    rating: 4.8,
    students: 1256,
    gradient: 'from-[#0A3D5C] to-[#1E6B8C]',
  },
  {
    title: '艺术漆技法精讲',
    instructor: '王艺涵',
    level: '进阶',
    duration: '10周',
    price: '¥399',
    rating: 4.9,
    students: 634,
    gradient: 'from-[#E8A020] to-[#C47F10]',
  },
  {
    title: '佰利认证工程师',
    instructor: '多位专家',
    level: '认证',
    duration: '20周',
    price: '¥999',
    rating: 5.0,
    students: 156,
    gradient: 'from-[#1E6B8C] to-[#0A3D5C]',
  },
]

const whyChooseUs = [
  {
    icon: <Award size={32} />,
    title: '权威认证',
    desc: '课程结业颁发佰利学院认证证书，行业广泛认可，助力职业发展',
  },
  {
    icon: <Shield size={32} />,
    title: '专业师资',
    desc: '汇聚10年以上行业经验的资深工程师和设计师，言传身教，确保教学质量',
  },
  {
    icon: <Zap size={32} />,
    title: '实战导向',
    desc: '理论与实践相结合，大量实操训练，让学员快速掌握核心施工技能',
  },
  {
    icon: <TrendingUp size={32} />,
    title: '就业支持',
    desc: '与200余家合作企业建立人才输送渠道，为学员提供就业推荐服务',
  },
]

const testimonials = [
  {
    name: '李师傅',
    role: '施工队长',
    content: '在佰利学院学习了仿石漆施工工艺，技术提升很大，现在接单量翻了3倍，收入也增加了不少。',
    rating: 5,
    avatar: 'from-[#0A3D5C] to-[#1E6B8C]',
  },
  {
    name: '张小红',
    role: '室内设计师',
    content: '艺术漆技法课程让我掌握了很多新型材料的施工方法，设计作品更有质感，客户非常满意。',
    rating: 5,
    avatar: 'from-[#E8A020] to-[#C47F10]',
  },
  {
    name: '王大明',
    role: '涂装公司老板',
    content: '送员工来佰利学院系统学习，技能水平明显提升，工程质量稳定，客户口碑越来越好。',
    rating: 5,
    avatar: 'from-[#1E6B8C] to-[#0A3D5C]',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E8A020] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
              style={{ backgroundColor: 'rgba(232,160,32,0.2)', color: '#E8A020', border: '1px solid rgba(232,160,32,0.4)' }}>
              <Star size={14} />
              <span>专业涂装培训领导品牌</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              专业涂装
              <span className="text-[#E8A020]"> · </span>
              技艺传承
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              佰利涂装应用学院，汇聚行业顶尖师资，传授专业施工工艺。
              从基础到高级，系统学习涂装技术，开启您的职业新篇章。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="px-8 py-3 rounded-lg font-semibold text-[#0A3D5C] transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
                style={{ backgroundColor: '#E8A020' }}
              >
                浏览课程
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 rounded-lg font-semibold text-white border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                了解学院
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0A3D5C]">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Categories */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D5C] mb-3">产品中心</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              覆盖艺术漆、质感涂料、功能涂料等多个品类，满足各类施工场景需求
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {productCategories.map((cat) => (
              <div key={cat.title} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className={`h-40 bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                  <span className="text-5xl">{cat.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0A3D5C] mb-2">{cat.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cat.items.map((item) => (
                      <span key={item} className="px-2 py-1 bg-blue-50 text-[#1E6B8C] text-xs rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/products"
                    className="flex items-center text-sm font-semibold text-[#E8A020] hover:text-[#C47F10] transition-colors"
                  >
                    查看详情 <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-2.5 border-2 border-[#0A3D5C] text-[#0A3D5C] rounded-lg font-semibold hover:bg-[#0A3D5C] hover:text-white transition-all duration-200"
            >
              查看全部产品 <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D5C] mb-3">热门课程</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              从入门到专业认证，系统学习涂装技术，提升职业竞争力
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.title} className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                <div className={`h-44 bg-gradient-to-br ${course.gradient} flex flex-col items-center justify-center text-white`}>
                  <BookOpen size={40} className="mb-2 opacity-80" />
                  <span className="text-sm opacity-70">{course.duration} · {course.level}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: course.level === '认证' ? '#E8A020' : course.level === '进阶' ? '#1E6B8C' : '#0A3D5C',
                        color: 'white',
                      }}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="font-medium text-gray-700">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#0A3D5C] mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">讲师: {course.instructor} · {course.students.toLocaleString()}人学习</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#E8A020]">{course.price}</span>
                    <Link
                      href="/courses"
                      className="px-4 py-1.5 bg-[#0A3D5C] text-white rounded-lg text-sm font-medium hover:bg-[#1E6B8C] transition-colors"
                    >
                      立即报名
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-2.5 border-2 border-[#0A3D5C] text-[#0A3D5C] rounded-lg font-semibold hover:bg-[#0A3D5C] hover:text-white transition-all duration-200"
            >
              查看全部课程 <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D5C] mb-3">为什么选择我们</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              专注涂装教育10余年，我们深知学员需要什么
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 text-white"
                  style={{ backgroundColor: '#0A3D5C' }}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0A3D5C] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D5C] mb-3">学员心声</h2>
            <p className="text-gray-500">听听已经改变职业轨迹的学员怎么说</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#F8F9FA] rounded-xl p-6 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-5 italic">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatar} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A3D5C]">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0A3D5C] to-[#1E6B8C] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart size={40} className="text-[#E8A020] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">开启您的涂装技艺之旅</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            无论您是初学者还是有经验的从业者，佰利学院都有适合您的课程，助您实现职业目标
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="px-8 py-3 rounded-lg font-bold text-[#0A3D5C] transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: '#E8A020' }}
            >
              立即报名课程
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-lg font-bold text-white border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              联系我们
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            {['免费咨询', '专业指导', '灵活学习', '就业支持'].map((item) => (
              <div key={item} className="flex items-center space-x-1">
                <CheckCircle size={14} className="text-[#E8A020]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
