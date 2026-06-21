import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ChevronRight, Award, Users, BookOpen, Target, Eye, Heart } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: '关于学院 - 佰利涂装应用学院',
  description: '佰利涂装应用学院成立于2015年，专注涂装技术培训，拥有50余位认证讲师，培育了超过10000名专业涂装人才',
  openGraph: {
    title: '关于学院 - 佰利涂装应用学院',
    description: '佰利涂装应用学院成立于2015年，专注涂装技术培训，拥有50余位认证讲师，培育了超过10000名专业涂装人才',
    url: '/about',
  },
}

const instructors = [
  {
    name: '张建国',
    title: '首席涂装工程师',
    specialty: '艺术漆、仿石漆施工',
    years: 18,
    bg: 'from-[#0A3D5C] to-[#1E6B8C]',
    desc: '原一线施工总监，拥有丰富的高端项目施工经验，先后主持完成多个五星酒店、商业综合体涂装工程',
  },
  {
    name: '王艺涵',
    title: '艺术涂装设计师',
    specialty: '艺术肌理漆、金属质感漆',
    years: 12,
    bg: 'from-[#E8A020] to-[#C47F10]',
    desc: '国内知名艺术涂装设计师，擅长将设计美学与施工技艺结合，培训学员超过3000人次',
  },
  {
    name: '李功夫',
    title: '高级施工技术顾问',
    specialty: '基底处理、防水工艺',
    years: 20,
    bg: 'from-[#1E6B8C] to-[#0A3D5C]',
    desc: '专注建筑涂装基础工艺研究20年，对各类基底处理及防水工艺有深厚造诣，发表技术论文多篇',
  },
  {
    name: '陈丽娟',
    title: '环保涂料专家',
    specialty: '硅藻泥、藻泥涂料',
    years: 10,
    bg: 'from-[#2D7A4F] to-[#1E5C3A]',
    desc: '生态环保建材领域专家，深耕硅藻泥及藻泥涂料施工技术，推动绿色建材在行业内的普及应用',
  },
]

const milestones = [
  { year: '2015', event: '佰利涂装应用学院正式成立，首批招募学员50人' },
  { year: '2017', event: '与广东省涂装协会签署合作协议，课程获得行业认证' },
  { year: '2019', event: '学员规模突破3000人，建立线上课程平台' },
  { year: '2021', event: '开设专业认证课程，与200余家企业建立人才输送合作' },
  { year: '2023', event: '学员总人数突破8000人，荣获"年度最佳涂装培训机构"称号' },
  { year: '2024', event: '完成学院升级改造，推出全新互动式教学体系，在培学员超10000人' },
]

const values = [
  {
    icon: <Target size={28} />,
    title: '我们的使命',
    desc: '传授专业涂装技艺，培育高素质行业人才，推动中国涂装行业技术水平持续提升',
  },
  {
    icon: <Eye size={28} />,
    title: '我们的愿景',
    desc: '成为中国最受信赖的涂装技术培训机构，让每一位学员都能掌握安身立命的一技之长',
  },
  {
    icon: <Heart size={28} />,
    title: '我们的价值观',
    desc: '以学员成长为中心，以实操技能为根本，以行业发展为己任，诚信教学、精益求精',
  },
]

const stats = [
  { value: '2015', label: '成立年份', icon: <Award size={20} /> },
  { value: '10000+', label: '培训学员', icon: <Users size={20} /> },
  { value: '500+', label: '合作企业', icon: <BookOpen size={20} /> },
  { value: '50+', label: '认证讲师', icon: <Award size={20} /> },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-blue-200 text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">首页</Link>
            <ChevronRight size={14} />
            <span>关于学院</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">关于佰利涂装应用学院</h1>
          <p className="text-blue-100 text-lg max-w-3xl leading-relaxed">
            十年匠心，专注涂装教育。佰利涂装应用学院是一所专注于涂装技术培训与推广的专业院校，
            致力于为行业培育具备实战能力的高素质涂装人才。
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                  style={{ backgroundColor: '#E8A020' + '20', color: '#E8A020' }}>
                  {s.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#0A3D5C]">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <h2 className="text-3xl font-bold text-[#0A3D5C] mb-6">学院简介</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  佰利涂装应用学院成立于2015年，是国内专注于建筑涂装技术培训领域的领先教育机构。
                  学院由一批具有丰富行业经验的资深工程师和设计师共同创办，秉承"技艺传承、实战为本"的教育理念，
                  致力于培育能够适应市场需求的高素质涂装人才。
                </p>
                <p>
                  经过近十年的发展，学院已构建起覆盖从基础入门到专业认证的完整课程体系，
                  涵盖艺术漆施工、质感涂料应用、防水工程、绿色建材等多个专业方向。
                  目前共开设课程200余门，累计培训学员超过10000人次，学员分布于全国各地。
                </p>
                <p>
                  学院坚持"实操为主、理论为辅"的教学模式，每门课程都包含大量的实际操作训练。
                  我们与国内多家知名涂料品牌和建筑工程公司建立了深度合作关系，
                  为学员提供真实的施工环境和就业机会，真正实现学以致用。
                </p>
                <p>
                  截至2024年，学院已与500余家企业建立人才输送合作，帮助毕业学员顺利就业或创业，
                  平均月收入提升幅度超过60%。学院荣获"年度最佳涂装培训机构"等多项行业荣誉，
                  获得了广大学员和合作企业的高度认可。
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="space-y-4">
              <div className="h-64 bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] rounded-2xl flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-5xl mb-3">🏫</div>
                  <div className="text-lg font-semibold">学院实训基地</div>
                  <div className="text-sm text-blue-200 mt-1">现代化施工实训室</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-gradient-to-br from-[#E8A020] to-[#C47F10] rounded-xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-3xl mb-1">🎓</div>
                    <div className="text-sm font-semibold">毕业典礼</div>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-br from-[#1E6B8C] to-[#0A3D5C] rounded-xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-3xl mb-1">🛠️</div>
                    <div className="text-sm font-semibold">实操课堂</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A3D5C] mb-3">使命·愿景·价值观</h2>
            <p className="text-gray-500">指引我们前行的核心信念</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-8 rounded-2xl border-2 border-gray-100 hover:border-[#E8A020] hover:shadow-lg transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 text-white"
                  style={{ backgroundColor: '#0A3D5C' }}>
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0A3D5C] mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Team */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A3D5C] mb-3">师资团队</h2>
            <p className="text-gray-500 max-w-xl mx-auto">汇聚行业顶尖专家，用实战经验传授真正有用的技能</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((ins) => (
              <div key={ins.name} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                <div className={`h-36 bg-gradient-to-br ${ins.bg} flex items-center justify-center`}>
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {ins.name[0]}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#0A3D5C]">{ins.name}</h3>
                  <p className="text-xs text-[#E8A020] font-semibold mb-2">{ins.title}</p>
                  <p className="text-xs text-gray-400 mb-3">专长：{ins.specialty} · {ins.years}年经验</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{ins.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A3D5C] mb-3">发展历程</h2>
            <p className="text-gray-500">每一步都见证着我们对教育品质的坚守</p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 md:left-1/2" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-4 border-white shadow-md -translate-x-1/2 z-10"
                    style={{ backgroundColor: '#E8A020' }} />
                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-5/12 ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2"
                      style={{ backgroundColor: '#0A3D5C' }}>
                      {m.year}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{m.event}</p>
                  </div>
                  <div className="hidden md:block md:w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A3D5C] mb-3">联系我们</h2>
            <p className="text-gray-500">有任何疑问或想了解更多课程信息，欢迎随时联系我们</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: <MapPin size={20} />, label: '学院地址', value: '广东省广州市天河区涂装产业园A栋108室' },
                { icon: <Phone size={20} />, label: '咨询热线', value: '400-888-8888（周一至周六 9:00-18:00）' },
                { icon: <Mail size={20} />, label: '电子邮件', value: 'info@baili-academy.com' },
                { icon: <Clock size={20} />, label: '开放时间', value: '周一至周六 09:00 - 18:00' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: '#E8A020' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</div>
                    <div className="text-gray-800 font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder + CTA */}
            <div className="space-y-4">
              <div className="h-56 bg-gradient-to-br from-[#0A3D5C] to-[#1E6B8C] rounded-xl flex items-center justify-center text-white">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 opacity-70" />
                  <p className="font-semibold">广州市天河区</p>
                  <p className="text-sm text-blue-200">涂装产业园A栋</p>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#0A3D5C] to-[#1E6B8C] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">准备好开始学习了吗？</h2>
          <p className="text-blue-100 mb-6">立即浏览课程，迈出涂装技能提升的第一步</p>
          <Link
            href="/courses"
            className="inline-block px-8 py-3 rounded-lg font-bold text-[#0A3D5C] bg-[#E8A020] hover:opacity-90 transition-all duration-200"
          >
            查看全部课程
          </Link>
        </div>
      </section>
    </div>
  )
}
